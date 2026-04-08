export function getPositiveRelativeTimeDiff(
  currentTime: string | number | Date,
  startTime: string | number | Date,
) {
  const start = new Date(startTime);
  const current = new Date(currentTime);

  // 验证日期有效性
  if (isNaN(start.getTime()) || isNaN(current.getTime())) {
    throw new Error("无效的日期格式");
  }

  // 计算两个时间的差值 -> 毫秒时间戳
  const diffMs = Math.abs(current.getTime() - start.getTime());

  // 按优先级返回结果
  if (Math.floor(Math.floor(Math.floor(diffMs / 60000) / 60) / 24) > 0)
    return `${Math.floor(Math.floor(Math.floor(diffMs / 60000) / 60) / 24)} 天 ${Math.floor(Math.floor(diffMs / 60000) / 60) % 24} 小时 后`;
  if (Math.floor(Math.floor(diffMs / 60000) / 60) > 0)
    return `${Math.floor(Math.floor(diffMs / 60000) / 60)} 小时 ${Math.floor(diffMs / 60000) % 60} 分 后`;
  if (Math.floor(diffMs / 60000) > 0)
    return `${Math.floor(diffMs / 60000)} 分钟 后`;
  return `不到一分钟内`;
}
