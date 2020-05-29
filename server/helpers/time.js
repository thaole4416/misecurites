function getToday() {
  let today = new Date();
  let date = today.getDate();
  date = date < 10 ? "0" + date : date.toString();
  let month = today.getMonth() + 1;
  month = month < 10 ? "0" + month : month.toString();
  let year = today.getFullYear().toString();
  return `${month}/${date}/${year}`;
}

function isVacation(date) {
  return false;
}

function excuteCodeAtTime(fn, time) {
  var now = new Date();
  var msTillExcute =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      time.hour,
      time.minute,
      time.second,
      time.milisecond
    ) - now;
  if (msTillExcute < 0) {
    msTillExcute += 86400000;
  }
  console.log(msTillExcute);
  setTimeout(function () {
    if (now.getDay() != 0 && now.getDay() != 6 && !isVacation(now)) {
      fn();
    }
    setTimeout(function () {
      excuteCodeAtTime(fn, time);
    }, 60000);
  }, msTillExcute);
}

/**
 * return
 * 0: Phiên nghỉ
 * 1: Phiên định kỳ mở
 * 2: Phiên định kỳ đóng
 * 3: Phiên liên tục
 * 4: Phiên sau giờ
 * -1: nothing
 */
function getTradingSession(exchange) {
  const now = new Date();
  const timeNow = now.getTime();
  const start_DinhKy_Mo = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    9,
    0,
    0,
    0
  );
  const end_DinhKy_Mo = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    9,
    15,
    0,
    0
  );
  const start_DinhKy_Dong = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    14,
    30,
    0,
    0
  );
  const end_DinhKy_Dong = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    14,
    45,
    0,
    0
  );

  const start_SauGio = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    14,
    45,
    0,
    0
  );
  const end_SauGio = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    15,
    0,
    0,
    0
  );

  const start_Nghi = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    11,
    30,
    0,
    0
  );
  const end_Nghi = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    13,
    0,
    0,
    0
  );

  if (
    timeNow >= start_DinhKy_Mo &&
    timeNow < end_DinhKy_Mo &&
    exchange == "HOSE"
  ) {
    return 1;
  } else if (
    timeNow >= start_DinhKy_Mo &&
    timeNow < end_DinhKy_Mo &&
    exchange != "HOSE"
  ) {
    return 3;
  } else if (timeNow >= end_DinhKy_Mo && timeNow < start_Nghi) {
    return 3;
  } else if (timeNow >= start_Nghi && timeNow < end_Nghi) {
    return 0;
  } else if (timeNow >= end_Nghi && timeNow < start_DinhKy_Dong) {
    return 3;
  } else if (
    timeNow >= start_DinhKy_Dong &&
    timeNow < end_DinhKy_Dong &&
    (exchange == "HOSE" || exchange == "HNX")
  ) {
    return 2;
  } else if (
    timeNow >= start_DinhKy_Dong &&
    timeNow < end_DinhKy_Dong &&
    exchange != "HOSE" &&
    exchange != "HNX"
  ) {
    return 3;
  } else if (
    timeNow >= start_SauGio &&
    timeNow < end_SauGio &&
    exchange != "HNX"
  ) {
    return 4;
  } else return -1;
}

module.exports = {
  getToday: getToday,
  excuteCodeAtTime: excuteCodeAtTime,
  getTradingSession: getTradingSession,
};
