const isCompliantPassword = password => 
  /^(?=.*[a-z])(?=.*[.A-Z])(?=.*\d)[a-zA-Z\d-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]{8,}$/.test(password);

export default isCompliantPassword;
