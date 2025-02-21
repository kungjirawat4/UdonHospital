export const dayChart = () => ({
  // title: {
  //   text: 'รับบริการรายชั่วโมง',
  //   subtext: 'Fake Data',
  //   left: 'center',
  // },
  tooltip: {
    trigger: 'item',
  },
  xAxis: {
    type: 'category',
    data: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
    },
  ],
});
