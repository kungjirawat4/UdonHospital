export const days = {
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
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
};

export const hours = {
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
    data: ['08:00', ':', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
};

export const pies = {
  // title: {
  //   text: 'รับบริการประจำวัน',
  //   // subtext: 'Fake Data',
  //   left: 'center',
  // },
  tooltip: {
    trigger: 'item',
  },
  // legend: {
  //   orient: 'vertical',
  //   left: 'left',
  // },
  series: [
    {
      name: 'ห้องยา OPD',
      type: 'pie',
      radius: '50%',
      data: [
        {
          value: 1048,
          name: 'A ทั่วไป 2',
          itemStyle: {
            color: '#5470c6',
          },
        },
        {
          value: 735,
          name: 'A รับคำปรึกษา 2',
          itemStyle: {
            color: '#ee6666',
          },
        },
        {
          value: 580,
          name: 'C ทั่วไป 3',
          itemStyle: {
            color: '#91cc75',
          },
        },
        {
          value: 484,
          name: 'D จิตเวช 3',
          itemStyle: {
            color: '#fac858',
          },
        },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
};

export const rotation = {
  // title: {
  //   text: 'ผู้รับยาตามประเภท',
  //   // subtext: 'Fake Data',
  //   left: 'left',
  // },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: ['A', 'B', 'C', 'D'],
  },
  toolbox: {
    show: true,
    orient: 'vertical',
    left: 'right',
    top: 'center',
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar', 'stack'] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: [
        'ม.ค',
        'ก.พ',
        'มี.ค',
        'พ.ค',
        'มิ.ย',
        'ก.ค',
        'ส.ค',
        'ก.ย',
        'ต.ค',
        'พ.ย',
        'ธ.ค',
      ],
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [
    {
      name: 'A',
      type: 'bar',
      barGap: 0,
      label: {
        show: false,
        position: 'inside',
      },
      itemStyle: {
        color: '#5470c6',
      },
      emphasis: {
        focus: 'series',
      },
      data: [320, 332, 301, 334, 390],
    },
    {
      name: 'B',
      type: 'bar',
      // label: labelOption,
      label: {
        show: false,
        position: 'inside',
      },
      itemStyle: {
        color: '#ee6666',
      },
      emphasis: {
        focus: 'series',
      },
      data: [220, 182, 191, 234, 290],
    },
    {
      name: 'C',
      type: 'bar',
      // label: labelOption,
      label: {
        show: false,
        position: 'inside',
      },
      emphasis: {
        focus: 'series',
      },
      itemStyle: {
        color: '#91cc75',
      },
      data: [150, 232, 201, 154, 190],
    },
    {
      name: 'D',
      type: 'bar',
      // label: labelOption,
      label: {
        show: false,
        position: 'inside',
      },
      itemStyle: {
        color: '#fac858',
      },
      emphasis: {
        focus: 'series',
      },
      data: [98, 77, 101, 99, 40],
    },
  ],
};
