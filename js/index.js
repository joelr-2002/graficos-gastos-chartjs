function chartData() {
    return {
        showForm: false,
        errorMessage: '',
        totalBudget: {
            budget: 1629485.25,
            executed: 1333035.00
        },
        monthlyData: [10084.18, 14690.94, 45470.47, 22418.85, 71616.47, 252066.49, 165100.52, 260701.77, 289940.88, 200944.43],
        monthLabels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre'],
        barChart: null,
        pieChart: null,
        monthlyChart: null,

        init() {
            this.createMonthlyChart();
            this.createBarChart();
            this.createPieChart();
        },

        createMonthlyChart() {
            const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
            const monthlyPercentages = this.monthlyData.map(value => (value / this.totalBudget.executed) * 100);
            const suggestedMax = Math.max(...monthlyPercentages) + 10;
            this.monthlyChart = new Chart(monthlyCtx, {
                type: 'bar',
                data: {
                    labels: this.monthLabels,
                    datasets: [{
                        label: '% Ejecutado Mensual',
                        data: monthlyPercentages,
                        backgroundColor: '#00A797'
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: `TOTAL EJECUTADO: L ${this.totalBudget.executed.toLocaleString()}`,
                            font: {
                                size: 28,
                                weight: 'bold'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            suggestedMax: suggestedMax,
                            title: {
                                display: true,
                                text: 'Porcentaje (%)'
                            }
                        }
                    },
                    animation: {
                        onComplete: function(animation) {
                            const chartInstance = animation.chart;
                            const ctx = chartInstance.ctx;
                            ctx.textAlign = 'center';
                            ctx.fillStyle = '#000';
                            ctx.font = '18px Arial';

                            chartInstance.data.datasets.forEach((dataset, i) => {
                                const meta = chartInstance.getDatasetMeta(i);
                                meta.data.forEach(bar => {
                                    const data = dataset.data[meta.data.indexOf(bar)];
                                    const value = this.monthlyData[meta.data.indexOf(bar)];
                                    ctx.fillStyle = bar.options.backgroundColor;
                                    ctx.fillText(`${data.toFixed(2)}%`, bar.x, bar.y - 35);
                                    ctx.fillStyle = '#000';
                                    ctx.fillText(`L ${value.toLocaleString()}`, bar.x, bar.y - 10);
                                });
                            });
                        }.bind(this)
                    }
                }
            });
        },

        createBarChart() {
            const barCtx = document.getElementById('barChart').getContext('2d');
            this.barChart = new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: ['Total Presupuestado'],
                    datasets: [
                        {
                            label: 'Presupuesto (L)',
                            data: [this.totalBudget.budget],
                            backgroundColor: '#00A797'
                        },
                        {
                            label: 'Ejecutado (L)',
                            data: [this.totalBudget.executed],
                            backgroundColor: '#5B9BC6'
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Valores en L'
                            }
                        }
                    },
                    animation: {
                        onComplete: function(animation) {
                            const chartInstance = animation.chart;
                            const ctx = chartInstance.ctx;
                            ctx.textAlign = 'center';
                            ctx.fillStyle = '#000';
                            ctx.font = '18px Arial';

                            chartInstance.data.datasets.forEach((dataset, i) => {
                                const meta = chartInstance.getDatasetMeta(i);
                                meta.data.forEach((bar, index) => {
                                    const data = dataset.data[index];
                                    ctx.fillText(`L ${data.toLocaleString()}`, bar.x, bar.y - 10);
                                });
                            });
                        }
                    }
                }
            });
        },

        createPieChart() {
            const pieCtx = document.getElementById('pieChart').getContext('2d');
            const executedPercent = (this.totalBudget.executed / this.totalBudget.budget) * 100;
            const remainingPercent = 100 - executedPercent;
            this.pieChart = new Chart(pieCtx, {
                type: 'pie',
                data: {
                    labels: ['% Ejecutado', '% No Ejecutado'],
                    datasets: [{
                        data: [executedPercent, remainingPercent],
                        backgroundColor: ['#00A797', '#5B9BC6']
                    }]
                },
                options: {
                    animation: {
                        onComplete: function(animation) {
                            const chartInstance = animation.chart;
                            const ctx = chartInstance.ctx;
                            chartInstance.data.datasets.forEach((dataset, i) => {
                                const meta = chartInstance.getDatasetMeta(i);
                                const totalBudget = chartInstance.config.options.totalBudget;
                    
                                meta.data.forEach((piece, index) => {
                                    const middleAngle = (piece.startAngle + piece.endAngle) / 2;
                                    const x = pieCtx.canvas.width / 2 + Math.cos(middleAngle) * (piece.outerRadius / 1.5);
                                    const y = pieCtx.canvas.height / 2 + Math.sin(middleAngle) * (piece.outerRadius / 1.5);

                                    const value = index === 0 ? totalBudget.executed : totalBudget.budget - totalBudget.executed;
                                    const formattedValue = `L ${value.toLocaleString()}`;

                                    // Draw the value above the percentage
                                    ctx.fillStyle = '#fff';
                                    ctx.textAlign = 'center';
                                    ctx.font = '24px Arial';
                                    ctx.fillText(formattedValue, x, y - 20);

                                    // Draw the percentage
                                    ctx.font = '20px Arial';
                                    ctx.fillText(`${dataset.data[index].toFixed(2)}%`, x, y + 10);
                                });
                            });
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: `TOTAL PRESUPUESTADO: L ${this.totalBudget.budget.toLocaleString()}`,
                            font: {
                                size: 28,
                                weight: 'bold'
                            }
                        }
                    },
                    totalBudget: this.totalBudget 
                }
            });
        },

        updateCharts() {
            const totalMonthlyExecuted = this.monthlyData.reduce((sum, value) => sum + value, 0);

            // Validación de ejecución mensual
            if (totalMonthlyExecuted !== this.totalBudget.executed) {
                this.errorMessage = 'La suma del ejecutado mensual debe ser igual al ejecutado total.';
                return;
            }

            // Validación de presupuesto total
            if (this.totalBudget.executed > this.totalBudget.budget) {
                this.errorMessage = 'El ejecutado total no puede exceder el presupuesto total.';
                return;
            }

            // Reset error message
            this.errorMessage = '';

            if (this.barChart) {
                this.barChart.destroy();
            }
            if (this.pieChart) {
                this.pieChart.destroy();
            }
            if (this.monthlyChart) {
                this.monthlyChart.destroy();
            }

            this.createMonthlyChart();
            this.createBarChart();
            this.createPieChart();
        },

        addMonth() {
            this.monthLabels.push('Nuevo Mes');
            this.monthlyData.push(0.00);
        },

        removeMonth(index) {
            this.monthLabels.splice(index, 1);
            this.monthlyData.splice(index, 1);
        },

        downloadChart(chartId) {
            const link = document.createElement('a');
            link.href = document.getElementById(chartId).toDataURL('image/png');
            link.download = `${chartId}.png`;
            link.click();
        },

        copyToClipboard(chartId) {
            const canvas = document.getElementById(chartId);
            canvas.toBlob(blob => {
                const item = new ClipboardItem({ "image/png": blob });
                navigator.clipboard.write([item]).then(() => {
                    alert(`Imagen ${chartId} copiada al portapapeles!`);
                }).catch(err => {
                    console.error('Error al copiar la imagen al portapapeles', err);
                });
            });
        }
    };
}