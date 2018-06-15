const Fields = {
  createUser: ['email', 'name', 'password'],
  loginUser: ['email'],
  createIdea: ['content', 'impact', 'ease','confidence'],
  logoutUser: ['refresh_token'],
  refreshToken: ['refresh_token'],
  signInUser: ['email', 'password'],
  patternedFields: {
    password: {
      pattern: /^(?=.*[a-z])(?=.*[.A-Z])(?=.*\d)[a-zA-Z\d-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]{8,}$/,
      error: 'password not compliant',
    },
    email: {
      pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/,
      error: 'invalid email address',
    },
  },
};

const verifyUserInputs = (operationType, userInputs) => {
  const userInputsKeys = Object.keys(userInputs);
  const expectedFields = Fields[operationType];
  return new Promise((resolve, reject) => {
    expectedFields.forEach((field) => {
      if(!userInputsKeys.includes(field)) {
        return reject(`no value provided for ${field}`);
      } else if(field in Fields['patternedFields']) {
        const userValue = userInputs[field];
        const { pattern, error } = Fields['patternedFields'][field];
        if(!pattern.test(userValue)) {
          return reject(error);
        }
      } 
    });
    return resolve(true);
  });
};

export default verifyUserInputs;
