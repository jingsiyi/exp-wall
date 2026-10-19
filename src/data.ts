export type Chapter = { title: string; body: string; image: string }

const story = '这里放你自己的故事'
const titles = [
  '故事的入口', '留白的邀请', '一个人的注脚', '未命名的序章', '把想象打开',
  '正在发生', '向内凝视', '微小的勇气', '等待被看见', '不确定的方向',
  '日常的回声', '光线经过', '仍然出发', '与世界相遇', '安静的热烈',
  '在途中', '重新命名', '留下痕迹', '下一页', '故事继续',
]

export const chapters: Chapter[] = titles.map((title, index) => ({
  title,
  body: story,
  image: `/images/${index + 1}.png`,
}))

export const marqueeImages = Array.from({ length: 21 }, (_, index) => `/images/${index + 1}.png`)
