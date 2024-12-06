function chartCustomizer() {
    return {
        selectedChartType: 'bar',
        fontSize: 14,
        fontFamily: 'Arial',
        datasets: [
            {
                labels: 'Enero,Febrero,Marzo',
                data: '100,200,300',
                color: '#00A797',
                label: 'Conjunto de Datos 1'
            }
        ],
        customChart: null,

        init() {
            this.updateChart();
        },

        updateChart() {
            if (this.customChart) {
                this.customChart.destroy();
            }

            const chartData = this.datasets.map(dataset => {
                return {
                    label: dataset.label,
                    data: dataset.data.split(',').map(Number),
                    backgroundColor: dataset.color,
                };
            });

            const labels = this.datasets[0].labels.split(','); // Assumes all datasets use the same labels

            const ctx = document.getElementById('customChart').getContext('2d');
            this.customChart = new Chart(ctx, {
                type: this.selectedChartType,
                data: {
                    labels: labels,
                    datasets: chartData,
                },
                options: {
                    plugins: {
                        legend: {
                            labels: {
                                font: {
                                    size: this.fontSize,
                                    family: this.fontFamily
                                }
                            }
                        }
                    },
                    scales: this.selectedChartType === 'bar' ? {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    size: this.fontSize
                                }
                            },
                            title: {
                                display: true,
                                text: 'Valores',
                                font: {
                                    size: this.fontSize
                                }
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    size: this.fontSize
                                }
                            }
                        }
                    } : {}
                }
            });
        },

        addDataset() {
            this.datasets.push({
                labels: 'Nuevo,Mes',
                data: '0,0',
                color: '#FF5733',
                label: `Conjunto de Datos ${this.datasets.length + 1}`
            });
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