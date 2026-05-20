export const spaceBetweenWords = (word) =>
  word.replace(/([a-z])([A-Z])/g, '$1 $2');

export const alphabeticStringValidation = (val) => {
  const regex = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;
  return regex.test(val);
};

export const spaceNotAllowed = (val) => {
  const regex = /^(?!.*\s).+$/;
  return regex.test(val);
};


export const regularString = (val) => {
  let trimed = val
  if (typeof val !== 'object' && isNaN(val)) {
    trimed = val?.trim() || val
  }
  const regex =
    /^[\w!@#$%^&*()\-=_+{}[\]|;:'",.<>/?öäüÖÄÜß]+(?: [\w!@#$%^&*()\-=_+{}[\]|;:'",.<>/?öäüÖÄÜß]+)*$/;
  return regex.test(trimed);
};

export const stringSpace = (val) => {
  const regex = /^(?=.*[a-zA-Z])[a-zA-Z ]*$/
  return regex.test(val)
}

export const stringNumberSpace = (val) => {
  const regex = /^(?=.*[a-zA-Z0-9öäüÖÄÜß])[a-zA-Z0-9öäüÖÄÜß ]*$/
  return regex.test(val)
}

export const officeNameRegex = (val) => {
  const regex = /^(?=.*[a-zA-ZöäüÖÄÜß])[a-zA-Z0-9öäüÖÄÜß #@&_.-]*$/
  return regex.test(val)
}

export const addressRegex = (val) => {
  const regex = /^(?=.*[a-zA-Z0-9öäüÖÄÜß])[a-zA-Z0-9öäüÖÄÜß\s\,\#\.\''\-]*(?!\s)*[a-z A-Z0-9öäüÖÄÜß].*$/
  return regex.test(val)
}

export const stringValidation = (val) => {
  const regex = /^[a-zA-Z0-9öäüÖÄÜß_.-]*$/;
  return regex.test(val);
};

export const onlyAlphabeticStringValidation = (val) => {
  const regex = /^[A-Za-zöäüÖÄÜß]+$/;
  return regex.test(val);
};

export const emailValidation = (email) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email.toLowerCase());
};

export const phoneValidation = (phone) => {
  const regex =
    /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm;
  return regex.test(phone.toLowerCase());
};

export const passwordValidation = (password) => {
  // const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  const regex = /^(?=.*\d)(?=.*[!@#$%^&*öäüÖÄÜß])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
  return regex.test(password);
};

export const number = (value) => {
  const regex = /^(?=.*\d)[\d,.]+$/
  // const regex = /^(?=\d)(\d{1,3}(?:[,\.]\d{3})*)?(?:[\.]?\d{0,2})?$/;
  // const regex = /^(?=\d)(\d{1,3}(?:[\.,]\d{3})*)?(?:[\,]?\d{0,2})?$/;
  // const regex = /^(?=\d)(\d{1,3}(?:\.\d{3})*)(?:,\d{1,2})?$/;
  return regex.test(value);
};

export const numberOnly = (value) => {
  // const regex = /^[0-9]+$|^$/;
  // const regex = /^([0-9]+(,[0-9]+)?)?$/
  // const regex = /^\d{1,3}(?:,\d{3})*(?:\.\d+)?$/
  const regex = /^\d+$/
  return regex.test(value);
};

export const maxNumbers = (value) => {
  const regex = /^[\d.,]{1,9}$/
  // const regex = /^\d{1,3}(?:,\d{3})*(?:\.\d+)?$/
  // const regex = /^(0|[1-9][0-9]{0,5}|[1-9][0-9]{6}|1000000)(,[0-9]{1,2})?$/;
  return regex.test(value);
}

export const floatFromString = (value) => {
  const regex = /[+-]?\d+(\.\d+)?/g;
  return value.match(regex).map(function f(v) {
    return parseFloat(v);
  });
};

//capital every words firstletter
export const firstLetterToUppercase = (value) => {
  if (value) {
    return spaceBetweenWords(value.replace(/\b\w/g, (c) => c.toUpperCase()));
  }
}
//capital only firtletter of whole word
export const capitalFirstLetter = (value) => {
  if (value) {
    return value.charAt(0).toUpperCase() + value.slice(1)
  } else {
    return value
  }
}

export const phoneNumberValidation = (value) => {
  const regex = /^([+]\d{2})?\d{10}$/;
  return regex.test(value);
}

export const zipCodeValidation = (value) => {
  // const regex = /^0\d{4}$/;
  const regex = /^\d{5}$/;
  return regex.test(value);
}

export const specialCharacters = (value) =>
  /[-!$%^&*()_+|~=`{}[\]:/;<>?,.@#]/.test(value);

export const formatFieldName = (value) => {
  return value
    .replace(/Url$/i, "")               // REMOVE "Url" when at the end
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Convert camelCase to space-separated
    .replace(/_/g, ' ') // Convert snake_case to spaces
    .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize the first letter
    .replace(/\b\w/g, char => char.toUpperCase())
}

export const formatCharFieldName = (value) => {
  return value
    .replace(/(\d)/, ' $1')// Convert camelCase to space-separated
    .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize the first letter
    .replace(/\b\w/g, char => char.toUpperCase())
}


export const AllLettersUpercase = (value) => {
  if (value) {
    return value.toUpperCase()
  }
}


export const lettersWithSingleSpaces = (value) =>
  /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value);



