class DateUtils {
  getToday() {
    return new Date().toISOString().split('T')[0];
  }
}

export default new DateUtils();
