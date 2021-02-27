module.exports = url => {
    const level = url.match(/\//gi).length 
    let prefix = './'
    
    for ( let i = 1; i < level; i++ ) {
    	prefix += '../'
    }
    
    return prefix
}
