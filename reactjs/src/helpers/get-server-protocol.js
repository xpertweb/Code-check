module.exports = ()=>{
  if (process.env.NODE_ENV === 'development') {
    if (process.env.FEATHERS_HOST_URL.indexOf('jarvistest') > -1){
      return 'https://';
    } else {
      return 'http://';
    }
    
  } else {
    return 'https://';
  }
};