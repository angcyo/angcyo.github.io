/**
 * 图表相关操作
 * Email:angcyo@126.com
 * @author angcyo
 * @date 2023/06/06
 */

/*所有图表*/
const charts = []

const chartConfig = {
  backgroundColor: [
    'rgba(255, 99, 132, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 205, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(201, 203, 207, 0.2)'
  ],
  borderColor: [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)'
  ],
  borderWidth: 1
}

function getQueryVariable(variable) {
  const query = window.location.search.substring(1)
  const vars = query.split("&")
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=")
    if (pair[0] === variable) {
      return pair[1]
    }
  }
  return false
}

function destoryChart(id) {
  const index = charts.findIndex(item => item.canvas.id === id)
  if (index !== -1) {
    const chart = charts[index]
    chart.destroy()
    charts.splice(index, 1)
  }
}
