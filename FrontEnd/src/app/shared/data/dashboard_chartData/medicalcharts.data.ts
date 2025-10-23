

export let PatientsChartData: any = {
    series: [
        {
            name: "Patients",
            data: [
                {
                    x: 'Sun',
                    y: [2800]
                },
                {
                    x: 'Mon',
                    y: [3200]
                },
                {
                    x: 'Tue',
                    y: [2950]
                },
                {
                    x: 'Wed',
                    y: [3000]
                },
                {
                    x: 'Thu',
                    y: [3500]
                },
                {
                    x: 'Fri',
                    y: [4500]
                },
                {
                    x: 'Sat',
                    y: [4100]
                }
            ]
        }
    ],
    chart: {
        height: 323,
        type: 'bar',
        zoom: {
            enabled: false
        }
    },
    colors: ['var(--primary-color)'],
    plotOptions: {
        bar: {
            columnWidth: "25%",
            borderRadius: 4
        }
    },
    legend: {
        show: true,
        showForSingleSeries: true,
        position: 'top',
        horizontalAlign: 'center',
        customLegendItems: ['Patients']
    },
    dataLabels: {
        enabled: false,
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
    tooltip: {
        enabled: true,
        theme: "dark",
    }
};
export let PatientsChartData1: any = {
    series: [
        {
            type: "line",
            name: "This Year",
            data: [15, 30, 22, 49, 32, 45, 30, 45, 65, 45, 25, 45],
        },
        {
            type: "area",
            name: "Previous Year",
            data: [8, 40, 15, 32, 45, 30, 20, 25, 18, 23, 20, 40],
        }
    ],
    chart: {
        type: "line",
        height: 358,
        toolbar: {
            show: false
        },
    },
    plotOptions: {
        bar: {
            columnWidth: "40%",
            borderRadius: 4,
        }
    },
    colors: [
        "var(--primary07)",
        "rgba(215, 124, 247, 0.15)",
    ],
    fill: {
        type: 'solid',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
        }
    },
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: true,
        position: "top",
    },
    stroke: {
        curve: 'smooth',
        width: [2, 2],
        lineCap: 'round',
        dashArray: [4, 0]
    },
    grid: {
        borderColor: "#edeef1",
        strokeDashArray: 4,
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
    yaxis: {
        axisBorder: {
            show: true,
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
        },
        axisTicks: {
            show: true,
            borderType: "solid",
            color: "rgba(119, 119, 142, 0.05)",
            width: 6,
            offsetX: 0,
            offsetY: 0,
        },
    },
    xaxis: {
        type: "month",
        categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "sep",
            "oct",
            "nov",
            "dec",
        ],
        axisBorder: {
            show: false,
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
        },
        axisTicks: {
            show: false,
            borderType: "solid",
            color: "rgba(119, 119, 142, 0.05)",
            width: 6,
            offsetX: 0,
            offsetY: 0,
        },
        labels: {
            rotate: -90,
        },
    },
    tooltip: {
        enabled: true,
        theme: "dark",
    }
}
export let PodcastChartData: any = { 
    series: [{
        name: 'Hours',
        data: [40, 35, 66, 28, 38, 55, 45]
    }],
    chart: {
        height: 206,
        fontFamily: 'Poppins, Arial, sans-serif',
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    grid: {
        show: false,
        borderColor: '#f2f6f7',
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        position: 'top',
        fontSize: '13px',
    },
    colors: ["var(--primary08)"],
    stroke: {
        width: [1],
        curve: 'straight',
    },
    plotOptions: {
        bar: {
            columnWidth: "30%",
            borderRadius: 3,
            colors: {
                ranges: [{
                    from: 41,
                    to: 100,
                    color: 'rgba(215, 124, 247, 0.8)'
                }, {
                    from: 0,
                    to: 40,
                    color: 'var(--primary08)'
                }]
            },
        }
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
    labels: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
}


