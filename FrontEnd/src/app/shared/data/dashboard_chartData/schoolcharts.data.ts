export let AttendanceChartData: any = {
    series: [{
        name: 'Boys',
        data: [44, 42, 57, 86, 58, 55, 70],
    }, {
        name: 'Girls',
        data: [-34, -22, -37, -56, -21, -35, -60],
    }],
    chart: {
        stacked: true,
        type: 'bar',
        height: 300,
        toolbar: {
            show: false
        }
    },
    grid: {
        borderColor: "#f1f1f1",
        strokeDashArray: 2,
        xaxis: {
            lines: {
                show: true
            }
        },
        yaxis: {
            lines: {
                show: false
            }
        }
    },
    colors: ["var(--primary09)", "rgba(215, 124, 247, 0.9)"],
    plotOptions: {
        bar: {
            borderRadius: 5,
            borderRadiusApplication: 'end',
            borderRadiusWhenStacked: 'all',
            columnWidth: '25%',
        }
    },
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: true,
        position: 'top',
        fontFamily: "Montserrat",
        markers: {
            width: 10,
            height: 10,
        }
    },
    yaxis: {
        title: {
            text: 'Attendance',
            style: {
                color: '	#adb5be',
                fontSize: '14px',
                fontFamily: 'Montserrat',
                fontWeight: 500,
                cssClass: 'apexcharts-yaxis-label',
            },
        },
        labels: {
            formatter: function (y:any) {
                return y.toFixed(0) + "";
            }
        }
    },
    xaxis: {
        type: 'week',
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisBorder: {
            show: true,
            color: 'rgba(119, 119, 142, 0.05)',
            offsetX: 0,
            offsetY: 0,
        },
        axisTicks: {
            show: true,
            borderType: 'solid',
            color: 'rgba(119, 119, 142, 0.05)',
            width: 6,
            offsetX: 0,
            offsetY: 0
        },
        labels: {
            rotate: -90
        }
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    }
}
export let AttendanceChartData1: any = {
    chart: {
        height: 240,
        type: "radialBar",
    },
    series: [72, 84],
    colors: ["var(--primary09)", "rgba(215, 124, 247, 0.9)"],
    plotOptions: {
        radialBar: {
            hollow: {
                margin: 0,
                size: "60%",
                background: "#fff",
            },
            dataLabels: {
                name: {
                    offsetY: -10,
                    color: "#4b9bfa",
                    fontSize: "16px",
                    show: false,
                },
                value: {
                    offsetY: 10,
                    color: "#4b9bfa",
                    fontSize: "22px",
                    show: true,
                },
                total: {
                    show: true,
                    label: 'Total',
                }
            },
        },
    },
    stroke: {
        lineCap: "round",
    },
}
export let ReadyForCollectionData: any = {
    series: [
      {
        name: 'Ready For Collection',
        type: "column",
        data: [123, 11, 22, 35, 17, 28, 22, 37, 21, 44, 22, 30]
      },
      {
        name: 'Collected',
        type: "line",
        data: [30, 25, 36, 30, 45, 35, 64, 51, 59, 36, 39, 51]
      }
    ],
    chart: {
      fontFamily: 'Montserrat',
      height: 290,
      type: 'line',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    grid: {
      borderColor: '#f2f6f7',
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      }
    },
    dataLabels: {
      enabled: true
    },
    colors: ["var(--primary09)", "rgb(215, 124, 247)"],
    stroke: {
      width: [1.5, 1.5],
      curve: ['straight', 'straight'],
      dashArray: [0, 4]
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    legend: {
      show: true,
      position: 'top'
    },
    plotOptions: {
      bar: {
        columnWidth: "20%",
        borderRadius: 2
      }
    },
    tooltip: {
      enabled: true,
      theme: "dark"
    }
  };
  