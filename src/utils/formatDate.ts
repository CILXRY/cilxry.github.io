/// <reference types="node" />

/**
 * 格式化日期为 YYYY-MM-DD 格式
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * 格式化日期时间为 YYYY-MM-DD HH:mm:ss 格式
 */
export const formatDateTime = (date: Date): string => {
  const datePart = formatDate(date);
  const timePart = date.toTimeString().split(" ")[0];
  return `${datePart} ${timePart}`;
};

/**
 * 将日期或字符串转换为统一的字符串格式
 * @param dateInput 日期输入（Date 对象或字符串）
 * @param useDateTime 是否使用时间格式（包含时分秒）
 * @returns 格式化后的日期字符串
 */
export const normalizeDate = (
  dateInput: string | Date,
  useDateTime: boolean = false,
): string => {
  if (typeof dateInput === "string") {
    return dateInput;
  }

  return useDateTime ? formatDateTime(dateInput) : formatDate(dateInput);
};
