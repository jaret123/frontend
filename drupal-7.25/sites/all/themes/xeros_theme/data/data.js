var data = {
    news: [
        {   title: "UK Company Providing Breakthrough in Laundering Joins Sustainable Apparel Coalition",
            teaser: "November 11, 2013 A UK company delivering revolutionary clothes laundering technology has…",
            tags: "Commercial Laundry, Environment"
        },
        {   title: "In the News",
            teaser: "Forbes 10/16/2013 Xeros Greens The Business of Laundry http://www.forbes.com/sites/heatherclancy/2013/10/16/xeros-greens-the-business-of-laundry/ Green Lodging News…",
            tags: "Commercial Laundry"
        },
        {   title: "Xeros Brings Award-Winning Green and Sustainable Textile Cleaning to North America",
            teaser: "Establishes U.S. Headquarters and Appoints New Leadership Team Manchester, NH – October…",
            tags: "Commercial Laundry, North American"
        },
        {   title: "Xeros wins two new prestigious business awards",
            teaser: "14 October 2013 Xeros has won UK Sector Product of the Year…",
            tags: "Awards 2013"
        },
        {   title: "Xeros Helps Hotels Cut Laundry Costs By 50% and Support Green Operations",
            teaser: "Ultra Low Water System Uses less Detergent and Energy While Increasing Cleaning…",
            tags: "Commercial Laundry, Dry Cleaning Industry, North American"
        }
    ],
    kpis: [
        {
            title: "Overall Cost",
            unit: "",
            actualDollars: "6,816",
            potentialDollars: "3,408",
            percent: "50",
            cssClass: "overall",
            icon: "Globe"
        },
        {
            title: "Cold Water",
            unit: "Gallons",
            actualDollars: "1,234",
            potentialDollars: "619",
            percent: "50",
            cssClass: "gallons",
            icon: "Drop"
        },
        {
            title: "Hot Water",
            unit: "Efficiency",
            actualDollars: "731",
            potentialDollars: "300",
            percent: "63",
            cssClass: "efficiency",
            icon: "Thermometer"
        },
        {
            title: "Cycle Time",
            unit: "Labor",
            actualDollars: "63",
            potentialDollars: "38",
            percent: "34",
            cssClass: "labor",
            icon: "Clock"
        },
        {
            title: "Chemicals",
            unit: "Usage",
            actualDollars: "637",
            potentialDollars: "318",
            percent: "45",
            cssClass: "chemicals",
            icon: "Atom"
        },
    ],
    consumption: [
        {
            machine: "Unimac 1",
            capacity: "60lb",
            metric: [
                {
                    name: 'cold',
                    cssClass: 'show',
                    data: ["53,678", "35,231", 69],
                    details: [
                        {
                            type: "Total",
                            measures: [
                                [1, 'Gallons', 50, 60 ],
                                [2, 'Load Size', 50, 60],
                                [3, 'Gallons per Pound', 34, 42],
                                [4, 'Cost per Pound', .034, .067]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 8],
                                ['Cost Reduction', '$11']
                            ]
                        },
                        {
                            type: "White Bath Towels",
                            measures: [
                                [1, 'Gallons', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Gallons per Pound', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        },
                        {
                            type: "White Sheets",
                            measures: [
                                [1, 'Gallons', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Gallons per Pound', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        },
                        {
                            type: "White Table Linens",
                            measures: [
                                [1, 'Gallons', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Gallons per Pound', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        },
                        {
                            type: "Colored Table Linens",
                            measures: [
                                [1, 'Gallons', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Gallons per Pound', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        }
                    ]
                },
                {
                    name: 'hot',
                    data: [22, 45, 69],
                    details: [
                        {
                            type: "Total",
                            measures: [
                                [1, 'Gallons', 2, 2 ],
                                [2, 'Load Size', 2, 3],
                                [3, 'Cost per Therm', 4, 5],
                                [4, 'Cost per Pound', 6, 7]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 8],
                                ['Cost Reduction', '$11']
                            ]
                        },
                        {
                            type: "White Bath Towels",
                            measures: [
                                [1, 'Gallons', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Cost per Therm', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        },
                        {
                            type: "White Sheets",
                            measures: [
                                [1, 'Gallons', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Cost per Therm', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        },
                        {
                            type: "White Table Linens",
                            measures: [
                                [1, 'Gallons', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Cost per Therm', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        },
                        {
                            type: "Colored Table Linens",
                            measures: [
                                [1, 'Gallons', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Cost per Therm', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        }
                    ]
                },
                {
                    name: 'total',
                    data: [24, 14, 69],
                    details: [
                        {
                            type: "Total",
                            measures: [
                                [1, 'Gallons', 1, 2 ],
                                [2, 'Load Size', 2, 3],
                                [3, 'Gallons per Pound', 4, 5],
                                [4, 'Cost per Pound', 6, 7]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 8],
                                ['Cost Reduction', '$11']
                            ]
                        },
                        {
                            type: "White Bath Towels",
                            measures: [
                                [1, 'Gallons', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Gallons per Pound', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        },
                        {
                            type: "White Sheets",
                            measures: [
                                [1, 'Gallons', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Gallons per Pound', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        },
                        {
                            type: "White Table Linens",
                            measures: [
                                [1, 'Gallons', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Gallons per Pound', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        },
                        {
                            type: "Colored Table Linens",
                            measures: [
                                [1, 'Gallons', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Gallons per Pound', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        }
                    ]
                },
                {
                    name: 'cycle',
                    data: [58, 45, 69],
                    details: [
                        {
                            type: "Total",
                            measures: [
                                [1, 'Total Cycle Time', 1, 2 ],
                                [2, 'Load Size', 2, 3],
                                [3, 'Labor Cost', 4, 5],
                                [4, 'Cost per Pound', 6, 7]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 8],
                                ['Cost Reduction', '$11']
                            ]
                        },
                        {
                            type: "White Bath Towels",
                            measures: [
                                [1, 'Total Cycle Time', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Labor Cost', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        },
                        {
                            type: "White Sheets",
                            measures: [
                                [1, 'Total Cycle Time', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Labor Cost', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        },
                        {
                            type: "White Table Linens",
                            measures: [
                                [1, 'Total Cycle Time', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Labor Cost', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        },
                        {
                            type: "Colored Table Linens",
                            measures: [
                                [1, 'Total Cycle Time', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Labor Cost', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        }
                    ]
                },
                {
                    name: 'chem',
                    data: [43, 45, 69],
                    details: [
                        {
                            type: "Total",
                            measures: [
                                [1, 'Total Ounces', 1, 2 ],
                                [2, 'Load Size', 2, 3],
                                [3, 'Ounces per Pound', 4, 5],
                                [4, 'Cost per Pound', 6, 7]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 8],
                                ['Cost Reduction', '$11']
                            ]
                        },
                        {
                            type: "White Bath Towels",
                            measures: [
                                [1, 'Total Ounces', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Ounces per Pound', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        },
                        {
                            type: "White Sheets",
                            measures: [
                                [1, 'Total Ounces', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Ounces per Pound', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        },
                        {
                            type: "White Table Linens",
                            measures: [
                                [1, 'Total Ounces', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Ounces per Pound', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        },
                        {
                            type: "Colored Table Linens",
                            measures: [
                                [1, 'Total Ounces', 87, 34.9 ],
                                [2, 'Load Size', 50, 60 ],
                                [3, 'Ounces per Pound', 1.45, 0.58 ],
                                [4, 'Cost per Pound', 0.0412, 0.0166 ]

                            ],
                            summaryMeasures: [
                                ['Water Reduction', 59.89],
                                ['Cost Reduction', '$0.02480']
                            ]
                        }
                    ]
                }
            ]
        },
        {
            machine: "Unimac 2",
            capacity: "60lb",
            metric: [
                {
                    name: 'cold',
                    data: ["53,678", "35,231", 58]
                },
                {
                    name: 'hot',
                    data: [32, 14, 51]
                },
                {
                    name: 'total',
                    data: [34, 15, 52]
                },
                {
                    name: 'cycle',
                    data: [64, 35, 46]
                },
                {
                    name: 'chem',
                    data: [56, 34, 48]
                }
            ]
        },
        {
            machine: "Unimac 3",
            capacity: "60lb",
            metric: [
                {
                    name: 'cold',
                    data: ["53,678", "35,231", 58]
                },
                {
                    name: 'hot',
                    data: [32, 14, 51]
                },
                {
                    name: 'total',
                    data: [34, 15, 52]
                },
                {
                    name: 'cycle',
                    data: [64, 35, 46]
                },
                {
                    name: 'chem',
                    data: [56, 34, 48]
                }
            ],
            cssClass: "last"
        }
    ]


};
