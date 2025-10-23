
export let CustomersChartData: any = { 
    series: [{
        data: [0, 32, 18, 58]
    }],
    chart: {
        height: 40,
        width: 100,
        type: 'area',
        fontFamily: 'Poppins, Arial, sans-serif',
        foreColor: '#5d6162',
        zoom: {
            enabled: false
        },
        sparkline: {
            enabled: true
        }
    },
    tooltip: {
        enabled: true,
        theme: "dark",
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function () {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    title: {
        text: undefined,
    },
    grid: {
        borderColor: 'transparent',
    },
    xaxis: {
        crosshairs: {
            show: false,
        }
    },
    colors: ["rgb(215, 124, 247)"],
    stroke: {
         curve: 'smooth',
         width: [1.5],
    },
    fill: {
        type: 'gradient',
        gradient: {
            opacityFrom: 0.5,
            opacityTo: 0.2,
            stops: [0, 60]
        }
    },
}
export let RatioChartData: any = { 
    series: [{
        data: [0, 32, 18, 58]
    }],
    chart: {
        height: 40,
        width: 100,
        type: 'area',
        fontFamily: 'Poppins, Arial, sans-serif',
        foreColor: '#5d6162',
        zoom: {
            enabled: false
        },
        sparkline: {
            enabled: true
        }
    },
    tooltip: {
        enabled: true,
        theme: "dark",
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function () {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    title: {
        text: undefined,
    },
    grid: {
        borderColor: 'transparent',
    },
    xaxis: {
        crosshairs: {
            show: false,
        }
    },
    colors: ["rgb(12, 215, 177)"],
    stroke: {
        curve: 'smooth',
        width: [1.5],
    },
    fill: {
        type: 'gradient',
        gradient: {
            opacityFrom: 0.5,
            opacityTo: 0.2,
            stops: [0, 60]
        }
    },
}
export let DealsChartData: any = { 
    series: [{
        data: [0, 32, 18, 58]
    }],
    chart: {
        height: 40,
        width: 100,
        type: 'area',
        fontFamily: 'Rajdhani',
        foreColor: '#5d6162',
        zoom: {
            enabled: false
        },
        sparkline: {
            enabled: true
        }
    },
    tooltip: {
        enabled: true,
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function () {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: [1.5],
    },
    title: {
        text: undefined,
    },
    grid: {
        borderColor: 'transparent',
    },
    xaxis: {
        crosshairs: {
            show: false,
        }
    },
    colors: ["var(--primary-color)"],
   
    fill: {
        type: 'gradient',
        gradient: {
            opacityFrom: 0.1,
            opacityTo: 1.8,
            stops: [0, 60],
            colorStops: [
                [
                    {
                        offset: 0,
                        color: 'var(--primary02)',
                        opacity: 1
                    },
                    {
                        offset: 60,
                        color: 'var(--primary02)',
                        opacity: 0.1
                    }
                ],
            ]
        }
    },
};
export let DealsData: any = { 
    series: [{
        data: [0, 32, 18, 58]
    }],
    chart: {
        height: 40,
        width: 100,
        type: 'area',
        fontFamily: 'Poppins, Arial, sans-serif',
        foreColor: '#5d6162',
        zoom: {
            enabled: false
        },
        sparkline: {
            enabled: true
        }
    },
    tooltip: {
        enabled: true,
        theme: "dark",
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function () {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    title: {
        text: undefined,
    },
    grid: {
        borderColor: 'transparent',
    },
    xaxis: {
        crosshairs: {
            show: false,
        }
    },
    colors: ["rgb(254, 124, 88)"],
    stroke: {
         curve: 'smooth',
        width: [1.5],
    },
    fill: {
        type: 'gradient',
        gradient: {
            opacityFrom: 0.5,
            opacityTo: 0.2,
            stops: [0, 60]
        }
    },
}

export let EarningChartData1: any = {  
    series: [{
        name: 'Profit',
        data: [14, 12, 17, 16, 18, 15, 18, 23, 28, 44, 40, 34, 34, 22, 37, 46, 21, 35, 40, 34, 46, 55, 62, 55, 23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 45, 35],
    },
    ],
    chart: {
        type: 'bar',
        height: 100,
        stacked: true,
        sparkline: {
            enabled: true,
        }
    },
    grid: {
        borderColor: '#f2f6f7',
    },
    colors: ["rgba(255,255,255,0.6)"],
    plotOptions: {
        bar: {
            columnWidth: '40%'
        }
    },
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: false,
        position: 'top',
    },
    yaxis: {
        title: {
            style: {
                color: '#adb5be',
                fontSize: '14px',
                fontFamily: 'poppins, sans-serif',
                fontWeight: 600,
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
        type: 'month',
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'sep', 'oct', 'nov', 'dec'],
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
        enabled: false,
    }
}

export let EarningChartData2: any = { 
    series: [{
        name: 'Profit',
        data: [9, 13, 21, 30, 34, 43, 48, 60, 67, 80, 95, 105]
    }
    ],
    chart: {
        type: 'area',
        height: 105,
        stacked: true,
        sparkline: {
            enabled: true
        },
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 7,
            left: 1,
            blur: 3,
            color: '#000',
            opacity: 0.2
        },
    },
    grid: {
        borderColor: '#f2f6f7',
    },
    colors: ["rgba(215, 124, 247,1)"],
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: 'smooth',
        width: 2,
    },
    legend: {
        show: false,
        position: 'top',
        fontFamily: "Montserrat",
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
            colorStops: [
                [
                    {
                        offset: 0,
                        color: "rgba(215, 124, 247,0.15)",
                        opacity: 1
                    },
                    {
                        offset: 75,
                        color: "rgba(215, 124, 247,0.15)",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: "rgba(215, 124, 247,0.15)",
                        opacity: 1
                    }
                ]
            ]
        }
    },
    yaxis: {
        title: {
            style: {
                color: '#adb5be',
                fontSize: '14px',
                fontFamily: 'poppins, sans-serif',
                fontWeight: 600,
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
        type: 'month',
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'sep', 'oct', 'nov', 'dec'],
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
        enabled: false,
    }
 }

export let RevenueChartData: any = { 
    series: [
        {
            name: "Revenue",
            type: "column",
            data: [18, 23, 28, 36, 44, 52, 61, 71, 76, 88, 91, 100],
        },
        {
            name: "Profit",
            type: "area",
            data: [ 34, 38, 46, 55, 59, 68, 73, 85, 92, 105, 125, 135],
        }
    ],
    chart: {
        toolbar: {
            show: false,
        },
        height: 310,
        stacked: false,
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 7,
            left: 1,
            blur: 3,
            color: ["transparent", "#000"],
            opacity: 0.2
        },
    },
    stroke: {
        width: [1.5, 1.5],
        curve: "smooth",
    },
    plotOptions: {
        bar: {
            columnWidth: "20%",
            borderRadius: 3,
        },
    },
    colors: [
        "var(--primary-color)",
        "rgb(215, 124, 247)"
    ],
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
            colorStops: [ 
                [
                    {
                        offset: 0,
                        color: "var(--primary-color)",
                        opacity: 1
                    },
                    {
                        offset: 75,
                        color: "var(--primary-color)",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: "var(--primary-color)",
                        opacity: 1
                    }
                ],
                [
                    {
                        offset: 0,
                        color: "rgba(215, 124, 247,0.15)",
                        opacity: 1
                    },
                    {
                        offset: 75,
                        color: "rgba(215, 124, 247,0.15)",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: "rgba(215, 124, 247,0.15)",
                        opacity: 1
                    }
                ],
            ]
        }
    },
    labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ],
    markers: {
        size: 0,
    },
    xaxis: {
        type: "month",
    },
    yaxis: {
        min: 0,
    },
    tooltip: {
        shared: true,
        theme: "dark",
        intersect: false,
        y: {
            formatter: function (y:any) {
                if (typeof y !== "undefined") {
                    return y.toFixed(0) + " points";
                }
                return y;
            },
        },
    },
    legend: {
        show: true,
        position: "top",
        horizontalAlign: "center",
        fontFamily: "Montserrat",
    },
}
export let SourceChartData1: any = { 
    series: [
        {
            name: 'Actual',
            data: [
                {
                    x: 'Mobile',
                    y: 1292,
                },
                {
                    x: 'Desktop',
                    y: 4432,
                },
                {
                    x: 'Laptop',
                    y: 5423,
                },
                {
                    x: 'Tablet',
                    y: 6653,
                }
            ]
        }
    ],
    chart: {
        height: 317,
        type: 'bar'
    },
    plotOptions: {
        bar: {
            columnWidth: '40%',
            distributed: true,
            borderRadius: 3,
        }
    },
    colors: ['var(--primary-color)', "rgba(215, 124, 247, 1)", "rgba(12, 215, 177, 1)", "rgba(254, 124, 88, 1)"],
    dataLabels: {
        enabled: false
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 3
    },
    legend: {
        show: false,
        showForSingleSeries: true,
        customLegendItems: ['Expected'],
        fontFamily: "Montserrat",
    },
    xaxis: {
        labels: {
            show: true,
            style: {
                colors: "#8c9097",
                fontSize: '11px',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        }
    },
    yaxis: {
        labels: {
            show: true,
            style: {
                colors: "#8c9097",
                fontSize: '11px',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        }
    },
    tooltip: {
        theme: "dark",
    }
}
export let SourceChartData2: any = { 
    series: [14, 23, 21, 17, 15, 10],
    chart: {
        type: 'polarArea',
        height: 357
    },
    stroke: {
        colors: ['#fff'],
    },
    fill: {
        opacity: 1,
        text:'none'
    },
    legend: {
        position: 'bottom',
        itemMargin: {
            horizontal: 5,
            vertical: 5
        },
        fontFamily: "Montserrat",
    },
    labels: ['Organic Search', 'Paid Search', 'Direct Traffic', 'Social Media', 'Referrals', "Others"],
    colors: ["var(--primary-color)", "rgb(215, 124, 247)", "rgb(12, 215, 177)", "rgb(254, 124, 88)", "rgb(12, 163, 231)", "rgb(243, 157, 45)"],
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }]
}