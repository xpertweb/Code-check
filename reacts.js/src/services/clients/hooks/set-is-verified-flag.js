module.exports=function (options = {}) {
  return (hook) => {
    if (hook.data.googleId || hook.data.facebookId){
      hook.data.isVerified = true;
    }
    return Promise.resolve(hook);
  };
};
