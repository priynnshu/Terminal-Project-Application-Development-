process.stdin.setRawMode(true)
process.stdin.on('data',data=>{
    console.log(data)
    if(data[0]==0x03){
        process.stdout.write('\x1B[2J\x1B[3J\x1B[1H')
        process.exit(0)
    }
})