export function getOrderTypes(exchange) {
  switch (exchange) {
    case "HOSE":
      if (getTradingSession("HOSE") === -1 || getTradingSession("HOSE") === 0)
        return [];
      else if (getTradingSession("HOSE") === 1) return ["ATO", "LO"];
      else if (getTradingSession("HOSE") === 2) return ["ATC", "LO"];
      else if (getTradingSession("HOSE") === 3) return ["MP", "LO"];
      break;
    case "HNX":
      if (getTradingSession("HNX") === -1 || getTradingSession("HNX") === 0)
        return [];
      else if (getTradingSession("HNX") === 2) return ["ATC", "LO"];
      else if (getTradingSession("HNX") === 3)
        return ["MAK", "MOK", "MTL", "LO"];
      else if (getTradingSession("HNX") === 4) return ["PLO", "LO"];
      break;
    case "UPCOM":
      if (getTradingSession("UPCOM") === -1 || getTradingSession("UPCOM") === 0)
        return [];
      else if (getTradingSession("UPCOM") === 3) return ["LO"];
      break;

    default:
      return [];
      break;
  }
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
