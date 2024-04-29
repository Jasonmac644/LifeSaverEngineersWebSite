const ValidatePhoneNumber = (v) => {
  if (v.length === 10) {
    const regexPattern =
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    return regexPattern.test(v);
  }
};

const ValidateEmail = (v) => {
  const isValidEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return isValidEmail.test(v)
};
export default { ValidatePhoneNumber, ValidateEmail };
