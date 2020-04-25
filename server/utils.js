class Util {
  static getToday() {
    let today = new Date();
    let date = today.getDate();
    date = date < 10 ? "0" + date : date.toString();
    let month = today.getMonth() + 1;
    month = month < 10 ? "0" + month : month.toString();
    let year = today.getFullYear().toString();
    return `${month}/${date}/${year}`;
  }
}

module.exports = Util