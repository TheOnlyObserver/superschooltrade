function ifNew(ifnewpercent) {
  switch (ifnewpercent) {
    case '100':
      {
        return '全新'
        break;
      }
    case '99':
      {
        return '99新'
        break;
      }
    case '95':
      {
        return '95新'
        break;
      }
    case '90':
      {
        return '9成新'
        break;
      }
    case '80':
      {
        return '8成新'
        break;
      }
    case '70':
      {
        return '7成新'
        break;
      }
    case '50':
      {
        return '5成新'
        break;
      }
    case '40':
      {
        return '能用'
        break;
      }
    case '10':
      {
        return '不能用'
        break;
      }

  }
}


module.exports = {
  ifNew: ifNew
};