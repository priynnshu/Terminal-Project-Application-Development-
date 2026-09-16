const {join} =require('path')
const {readdirSync}=require('fs')
const {spawn}=require('child_process')
process.stdin.setRawMode(true)

const songsDir=join(__dirname,'songs')
let i=0
let output=[]
let processPlay=undefined
let hasStarted=false
let isPlaying=false
let duration=0
let elapsedDuration=0

function getDuration(songPath){
    finalDir=join(songPath,output[i])
    const info=spawn('afinfo',[finalDir])
    info.stdout.on('data',data=>{
        const rawOutput=data.toString()
        duration=Number(rawOutput.split("estimated duration: ")[1].split(".")[0])

    })
}
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secondsRemaining).padStart(2, '0')}`;
}
function progressBar(current, total) {
    const width = 30;
    const percentage = current / total;
    const filled = Math.floor(width * percentage);
    return '█'.repeat(filled) +'░'.repeat(width - filled);
}
function listSongs(songPath){
    output=readdirSync(songPath)
    process.stdout.write('\x1B[2J\x1B[3J\x1B[1H');
    output.forEach((data,index) => {
        if (i==index){
            console.log(`> ${data}`)
        }
        else{
            console.log(`${data}\x1B[0K`)
        }
    });
    if(hasStarted){
        const a="          "
        console.log(progressBar(elapsedDuration,duration))
        console.log(`${a}${formatTime(elapsedDuration)}/${formatTime(duration)}`)
    }
}
listSongs(songsDir)

process.stdin.on('data',data=>{
    if(data[0]==0x1b && data[1]==0x5b){
        if(data[2]==0x41){
            if(i>=1){
                i-=1
                listSongs(songsDir)
            }
        }
        if(data[2]==0x42){
            if(i < output.length - 1){
                i+=1
                listSongs(songsDir)
            }
        }
        if(data[2]==0x43){
            if(i < output.length - 1){
                i+=1
                if(processPlay){
                    processPlay.kill('SIGKILL')
                }
                listSongs(songsDir)
                PlaySong(songsDir)
            }
        }
        if(data[2]==0x44){
            if(i >=1){
                i-=1
                if(processPlay){
                    processPlay.kill('SIGKILL')
                }
                listSongs(songsDir)
                PlaySong(songsDir)
            }
        }
        
    }
    if(data[0]==0x03){
        process.exit()
    }
    if(data[0]==0x0d){
        if (!processPlay){
            PlaySong(songsDir)
        }
        else{
            processPlay.kill('SIGKILL')
            PlaySong(songsDir)
        }
    }
    if(data[0]==0x20 && processPlay){
        
        processPlay.stdin.write('pause\n')
        isPlaying=!isPlaying
    }
    if(data[0]==0x6c){
        processPlay.stdin.write('seek +10\n')
        elapsedDuration+=10
    }
    if(data[0]==0x6a){
        processPlay.stdin.write('seek -10\n')
        elapsedDuration-=10
        if (elapsedDuration<0){
            elapsedDuration=0
        }
    }
}
)
function PlaySong(songPath){
    finalDir =join(songPath,output[i])
    processPlay=spawn('vlc',["--intf","rc",finalDir])
    isPlaying=true
    hasStarted=true
    elapsedDuration=0
    duration=0
    getDuration(songPath)

}
setInterval(() => {
    listSongs(songsDir)
    if (isPlaying === true && processPlay !== undefined) {
        elapsedDuration += 1
        if (elapsedDuration >= duration && duration > 0) { 
            if (i < output.length - 1) {
                i += 1
                PlaySong(songsDir)
            } else {
                isPlaying = false 
            }
        }
    }
}, 1000)