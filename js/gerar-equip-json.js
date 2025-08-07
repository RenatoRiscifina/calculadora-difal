const dadosTexto = `
EQUIPAMENTO;Valor à Vista;Financiado (12x);Financiado (24x);Financiado (36x);Financiado (48x)
Plotter de Recorte 120 Motor Passo - Pronta Entrega;R$ 5.775,00;R$ 7.410,04;R$ 9.190,57;R$ 11.206,46;R$ 13.422,42
Plotter de Recorte 120 Motor Passo - Pré Venda;R$ 5.544,00;R$ 7.113,57;R$ 8.822,80;R$ 10.757,97;R$ 12.885,19
Plotter de Recorte 120 Motor Servo - Pronta Entrega;R$ 12.400,00;R$ 15.910,74;R$ 19.733,87;R$ 24.062,35;R$ 28.820,42
Plotter de Recorte 120 Motor Servo - Pré Venda;R$ 11.573,00;R$ 14.849,45;R$ 18.417,45;R$ 22.457,08;R$ 26.897,63
Plotter de Impressão i1600 180 - Eco - Pronta Entrega;R$ 35.000,00;R$ 44.909,34;R$ 55.700,45;R$ 67.917,93;R$ 81.347,97
Plotter de Impressão i1600 180 - Eco - Pré Venda;R$ 33.600,00;R$ 43.112,96;R$ 53.472,43;R$ 65.201,22;R$ 78.094,05
Plotter de Impressão i3200 180 - Eco - Pronta Entrega;R$ 46.375,00;R$ 59.504,87;R$ 73.803,09;R$ 89.991,26;R$ 107.786,06
Plotter de Impressão i3200 180 - Eco - Pré Venda;R$ 44.520,00;R$ 57.124,68;R$ 70.850,97;R$ 86.391,61;R$ 103.474,62
Plotter de Impressão i3200 180 - Eco - Pronta Entrega - OPORTUNIDADE;R$ 42.524,00;R$ 54.563,49;R$ 67.674,30;R$ 82.518,11;R$ 98.835,13
Plotter de Impressão XP600 60 - Eco - Pronta Entrega;R$ 19.450,00;R$ 24.956,76;R$ 30.953,53;R$ 37.742,97;R$ 45.206,23
CNC 10060 + Ruida + Chiller 5000 + Exaustor - Pronta Entrega;R$ 26.625,00;R$ 34.163,17;R$ 42.372,12;R$ 51.666,14;R$ 61.882,56
CNC 10060 + Ruida + Chiller 5000 + Exaustor - Pré Venda;R$ 25.560,00;R$ 32.796,65;R$ 40.677,24;R$ 49.599,50;R$ 59.407,26
CNC 6040 + Chiller 3000 - Pronta Entrega;R$ 12.938,00;R$ 16.600,92;R$ 20.589,77;R$ 25.105,88;R$ 30.070,20
CNC 6040 + Chiller 3000 - Pré Venda;R$ 12.420,00;R$ 15.936,40;R$ 19.765,70;R$ 24.101,16;R$ 28.866,91
CNC 4040 - Pronta Entrega;R$ 6.731,00;R$ 8.636,78;R$ 10.712,14;R$ 13.061,82;R$ 15.644,71
CNC 4040 - Pré Venda;R$ 6.462,00;R$ 8.291,69;R$ 10.284,19;R$ 12.540,06;R$ 15.019,82
Fiber Portátil 30W + Eixo Rotativo - Pronta Entrega;R$ 18.515,00;R$ 23.757,04;R$ 29.465,54;R$ 35.928,59;R$ 43.033,08
Fiber Portátil 30W + Eixo Rotativo - Pré Venda;R$ 17.774,00;R$ 22.806,17;R$ 28.286,13;R$ 34.490,43;R$ 41.310,49
Fiber Portátil 30W - Pronta Entrega;R$ 16.432,00;R$ 21.084,43;R$ 26.150,86;R$ 31.886,97;R$ 38.192,37
Fiber Portátil 30W - Pré Venda;R$ 15.774,00;R$ 20.239,93;R$ 25.103,25;R$ 30.609,41;R$ 36.662,04
Fiber Portátil 50W + Eixo Rotativo - Pronta Entrega;R$ 28.419,00;R$ 36.465,03;R$ 45.227,02;R$ 55.147,19;R$ 66.051,90
Fiber Portátil 50W - Pronta Entrega;R$ 26.335,00;R$ 33.791,07;R$ 41.910,61;R$ 51.103,39;R$ 61.208,54
Mini Fiber 20W - Sem eixo Rotativo - Pronta Entrega;R$ 13.865,00;R$ 17.790,51;R$ 22.065,33;R$ 26.905,20;R$ 32.225,42
Fiber Desktop 30W + Computador + Eixo Rotativo - Pronta Entrega;R$ 25.073,00;R$ 32.171,62;R$ 39.901,91;R$ 48.654,00;R$ 58.274,70
Fiber Desktop 50W + Computador + Eixo Rotativo - Pronta Entrega;R$ 32.480,00;R$ 41.675,87;R$ 51.690,01;R$ 63.027,84;R$ 75.490,92
Fiber Desktop 50W + Computador + Eixo Rotativo - Pré-venda;R$ 31.098,00;R$ 39.902,45;R$ 49.490,35;R$ 60.345,58;R$ 72.278,17
Fiber Portátil UV 5W + Eixo Rotativo + Chiller - Pronta Entrega;R$ 43.120,00;R$ 55.328,30;R$ 68.622,95;R$ 83.674,89;R$ 100.220,70
Fiber Portátil UV 5W + Eixo Rotativo + Chiller - Pré-venda;R$ 41.285,00;R$ 52.973,77;R$ 65.702,65;R$ 80.114,05;R$ 95.955,74
Fiber 3 em 1 - 1500W - Pronta Entrega;R$ 44.687,00;R$ 57.339,10;R$ 71.117,03;R$ 86.716,15;R$ 103.863,43
Fiber Desktop 50W + Esteira com CCD - Pronta Entrega;R$ 44.687,00;R$ 57.339,10;R$ 71.117,03;R$ 86.716,15;R$ 103.863,43
DTF UV 30cm XP600 - Pronta Entrega;R$ 42.933,00;R$ 55.088,22;R$ 68.325,05;R$ 83.311,55;R$ 99.785,41
DTF UV 30cm XP600 - Pré-venda;R$ 41.106,00;R$ 52.744,16;R$ 65.417,93;R$ 79.766,94;R$ 95.540,04
FlatBed 9060 UV 2x XP600 - Pronta Entrega;R$ 60.853,00;R$ 78.081,80;R$ 96.843,68;R$ 118.085,53;R$ 141.435,57
FlatBed 9060 UV 2x XP600 - Pré-venda;R$ 58.264,00;R$ 74.759,86;R$ 92.723,59;R$ 113.061,78;R$ 135.418,47
FlatBed 9060 UV 3x XP600 - Pronta Entrega;R$ 74.667,00;R$ 95.807,16;R$ 118.828,44;R$ 144.892,71;R$ 173.543,77
FlatBed 9060 UV 3x XP600 - Pré-venda;R$ 71.489,00;R$ 91.729,18;R$ 113.770,40;R$ 138.725,05;R$ 166.156,39
Plotter de Impressão XP600 180 - SUB - Pronta Entrega;R$ 27.431,00;R$ 35.197,44;R$ 43.654,97;R$ 53.230,43;R$ 63.756,22
Plotter de Impressão XP600 180 - SUB - Pré Venda;R$ 26.334,00;R$ 33.789,71;R$ 41.908,87;R$ 51.101,22;R$ 61.205,88
Plotter de Impressão i1600 E1 180 - SUB - Pronta Entrega;R$ 35.000,00;R$ 44.909,34;R$ 55.700,45;R$ 67.917,93;R$ 81.347,97
Plotter de Impressão i1600 E1 180 - SUB - Pré Venda;R$ 33.600,00;R$ 43.112,96;R$ 53.472,43;R$ 65.201,22;R$ 78.094,05
Plotter de Impressão i1600 A1 180 - SUB - Pronta Entrega;R$ 36.750,00;R$ 47.154,80;R$ 58.485,47;R$ 71.313,83;R$ 85.415,37
Plotter de Impressão i1600 A1 180 - SUB - Pré Venda;R$ 35.280,00;R$ 45.268,61;R$ 56.146,05;R$ 68.461,28;R$ 81.998,75
Plotter de Impressão i3200 E1 180 - SUB - Pronta Entrega;R$ 46.375,00;R$ 59.504,87;R$ 73.803,09;R$ 89.991,26;R$ 107.786,06
Plotter de Impressão i3200 E1 180 - SUB - Pré Venda;R$ 44.520,00;R$ 57.124,68;R$ 70.850,97;R$ 86.391,61;R$ 103.474,62
Plotter de Impressão i3200 A1 180 - SUB - Pronta Entrega;R$ 49.000,00;R$ 62.873,07;R$ 77.980,62;R$ 95.085,11;R$ 113.887,16
Plotter de Impressão i3200 A1 180 - SUB - Pré Venda;R$ 45.733,00;R$ 58.680,97;R$ 72.781,09;R$ 88.744,98;R$ 106.293,24
Plotter de Impressão 2X i3200 A1 180 - SUB - Pronta Entrega;R$ 80.000,00;R$ 102.649,91;R$ 127.315,30;R$ 155.240,99;R$ 185.938,22
Plotter de Impressão 2x i3200 A1 180 - SUB - Pré Venda;R$ 74.667,00;R$ 95.807,16;R$ 118.828,44;R$ 144.892,71;R$ 173.543,77
Plotter de Impressão XP600 60 - SUB - Pronta Entrega;R$ 16.975,00;R$ 21.781,03;R$ 27.014,72;R$ 32.940,20;R$ 39.453,77
DTF Têxtil 60cm 2x XP- Pronta Entrega;R$ 54.133,00;R$ 69.459,21;R$ 86.149,20;R$ 105.045,29;R$ 125.816,76
DTF Têxtil 60cm 2x XP - Pré-venda;R$ 54.133,00;R$ 69.459,21;R$ 86.149,20;R$ 105.045,29;R$ 125.816,76
DTF Têxtil 60cm 2x i1600- Pronta Entrega;R$ 63.467,00;R$ 81.436,17;R$ 101.004,30;R$ 123.158,97;R$ 147.512,42
DTF Têxtil 60cm 2x i1600 - Pré-venda;R$ 63.467,00;R$ 81.436,17;R$ 101.004,30;R$ 123.158,97;R$ 147.512,42
DTF Têxtil 30cm 2x XP- Pronta Entrega;R$ 35.467,00;R$ 45.508,70;R$ 56.443,94;R$ 68.824,62;R$ 82.434,05
DTF Têxtil 30cm 2x XP - Pré-venda;R$ 33.957,00;R$ 43.571,18;R$ 54.040,87;R$ 65.894,45;R$ 78.924,46
DTF Têxtil UV 30cm 2x i1600 - Pronta Entrega;R$ 58.800,00;R$ 75.447,69;R$ 93.576,75;R$ 114.102,13;R$ 136.664,59
DTF Têxtil UV 30cm 2x i1600 - Pré-venda;R$ 52.920,00;R$ 67.902,92;R$ 84.219,07;R$ 102.691,91;R$ 122.998,13
DTF Têxtil 30cm 1x XP- Pronta Entrega;R$ 14.944,00;R$ 19.174,93;R$ 23.782,35;R$ 28.998,78;R$ 34.732,93
Escavadeira 10HP - Pronta Entrega;R$ 41.000,00;R$ 52.608,08;R$ 65.249,09;R$ 79.561,01;R$ 95.293,34
Escavadeira 10HP - Pré-venda;R$ 39.255,00;R$ 50.369,03;R$ 62.472,03;R$ 76.174,81;R$ 91.237,56
Escavadeira 10HP - com SwingBoom - Pronta Entrega;R$ 45.000,00;R$ 57.740,58;R$ 71.614,86;R$ 87.323,06;R$ 104.590,25
Escavadeira 10HP - com SwingBoom - Pré-venda;R$ 43.085,00;R$ 55.283,39;R$ 68.567,25;R$ 83.606,98;R$ 100.139,35
Escavadeira 10HP - SB / Kubota - Pronta Entrega;R$ 89.200,00;R$ 114.454,66;R$ 141.956,56;R$ 173.093,70;R$ 207.321,11
Escavadeira 10HP - SB / Kubota - Pré-venda;R$ 85.404,00;R$ 109.583,85;R$ 135.915,30;R$ 165.727,28;R$ 198.498,01
Escavadeira 20HP - com SwingBoom - Pronta Entrega;R$ 65.000,00;R$ 83.403,06;R$ 103.443,68;R$ 126.133,30;R$ 151.074,80
Escavadeira 20HP - com SwingBoom - Pré-venda;R$ 62.234,00;R$ 79.853,86;R$ 99.041,61;R$ 120.765,61;R$ 144.645,66
Artic Banc 28L - Pronta Entrega;R$ 20.250,00;R$ 25.983,26;R$ 32.226,69;R$ 39.295,38;R$ 47.065,61
Artic Banc 28L - Pré-venda;R$ 19.330,00;R$ 24.802,79;R$ 30.762,56;R$ 37.510,10;R$ 44.927,32
Artic Vert 38L - Pronta Entrega;R$ 24.279,00;R$ 31.152,90;R$ 38.638,46;R$ 47.113,46;R$ 56.429,59
Artic Vert 38L - Pré-venda;R$ 23.200,00;R$ 29.768,48;R$ 36.921,44;R$ 45.019,89;R$ 53.922,08
Artic Banc 30L Touch - Pronta Entrega;R$ 22.500,00;R$ 28.870,29;R$ 35.807,43;R$ 43.661,53;R$ 52.295,12
Artic Banc 30L Touch - Pré-venda;R$ 21.477,00;R$ 27.557,79;R$ 34.179,68;R$ 41.676,85;R$ 49.918,10
Artic Vert 72L - Pronta Entrega;R$ 53.182,00;R$ 68.239,24;R$ 84.636,33;R$ 103.200,80;R$ 123.607,74
Artic Vert 72L - Pré-venda;R$ 50.870,00;R$ 65.272,51;R$ 80.956,62;R$ 98.713,86;R$ 118.233,46
Vuze Cream Banc - 28L - Pronta Entrega;R$ 17.100,00;R$ 21.941,42;R$ 27.213,65;R$ 33.182,76;R$ 39.744,29
Vuze Cream Banc - 28L - Pré-venda;R$ 17.100,00;R$ 21.941,42;R$ 27.213,65;R$ 33.182,76;R$ 39.744,29
Vuze Cream Banc - 38L - Pronta Entrega;R$ 23.391,00;R$ 30.013,62;R$ 37.225,55;R$ 45.390,76;R$ 54.366,34
Vuze Cream Banc - 38L - Pré-venda;R$ 23.391,00;R$ 30.013,62;R$ 37.225,55;R$ 45.390,76;R$ 54.366,34
Vuze Cream Vert - 60L - 2 sistemas - Pronta Entrega;R$ 48.591,00;R$ 62.348,35;R$ 77.329,87;R$ 94.291,67;R$ 112.936,88
Vuze Cream Vert - 60L - 2 sistemas - Pré-venda;R$ 48.591;R$ 62.348,35;R$ 77.329,87;R$ 94.291,67;R$ 112.936,88
Máquina Suco de Laranja - Pronta Entrega;R$ 16.875,00;R$ 21.652,72;R$ 26.855,57;R$ 32.746,15;R$ 39.221,34
Máquina Suco de Laranja - Pré-venda;R$ 15.000,00;R$ 19.246,86;R$ 23.871,62;R$ 29.107,69;R$ 34.863,42
Forno de Pizza 38cm - Pronta Entrega;R$ 25.650,00;R$ 32.912,13;R$ 40.820,47;R$ 49.774,14;R$ 59.616,44
Forno de Pizza 38cm - Pré-venda;R$ 22.800,00;R$ 29.255,23;R$ 36.284,86;R$ 44.243,68;R$ 52.992,39
Forno de Pizza 45cm - Pronta Entrega;R$ 28.575,00;R$ 36.665,27;R$ 45.475,43;R$ 55.450,14;R$ 66.414,81
Forno de Pizza 45cm - Pré-venda;R$ 23.813,00;R$ 30.554,89;R$ 37.896,70;R$ 46.208,95;R$ 55.346,17
Máquina Vácuo 40x40 Mesa - Pronta Entrega;R$ 11.985,00;R$ 16.121,44;R$ 20.625,96;R$ 25.725,89;R$ 31.331,97
Máquina Vácuo 40x40 Mesa - Pré-venda;R$ 11.414,00;R$ 14.645,51;R$ 18.164,56;R$ 22.148,77;R$ 26.528,40
Máquina Vácuo 40x40 Vert - Pronta Entrega;R$ 13.898,00;R$ 17.832,71;R$ 22.117,56;R$ 26.968,77;R$ 32.301,45
Máquina Vácuo 40x40 Vert - Pré-venda;R$ 13.236,00;R$ 16.983,50;R$ 21.064,46;R$ 25.684,86;R$ 30.763,81
Máquina Vácuo 60x60 Mesa - Pronta Entrega;R$ 17.978,00;R$ 23.067,86;R$ 28.610,64;R$ 34.886,06;R$ 41.784,30
Máquina Vácuo 60x60 Mesa - Pré-venda;R$ 17.121,00;R$ 21.968,44;R$ 27.247,21;R$ 33.223,75;R$ 39.793,43
Máquina Vácuo 60x60 Double - Pronta Entrega;R$ 36.465,00;R$ 46.789,11;R$ 58.031,91;R$ 70.760,78;R$ 84.752,96
Máquina Vácuo 60x60 Double - Pré-venda;R$ 34.729,00;R$ 44.561,54;R$ 55.269,02;R$ 67.391,82;R$ 80.717,77
Ultra Congelador - 3 Bandejas - Pronta Entrega;R$ 17.799,00;R$ 22.838,25;R$ 28.325,92;R$ 34.538,94;R$ 41.368,60
Ultra Congelador - 3 Bandejas - Pré-venda;R$ 16.951,00;R$ 21.750,30;R$ 26.976,67;R$ 32.893,86;R$ 39.398,32
Ultra Congelador - 5 Bandejas - Pronta Entrega;R$ 24.990,00;R$ 32.065,27;R$ 39.770,12;R$ 48.493,40;R$ 58.082,45
Ultra Congelador - 5 Bandejas - Pré-venda;R$ 23.800,00;R$ 30.538,35;R$ 37.876,30;R$ 46.184,19;R$ 55.316,62
Ultra Congelador - 10 Bandejas - Pronta Entrega;R$ 39.321,00;R$ 50.453,79;R$ 62.577,21;R$ 76.303,12;R$ 91.391,29
Ultra Congelador - 10 Bandejas - Pré-venda;R$ 37.449,00;R$ 48.051,64;R$ 59.597,74;R$ 72.670,01;R$ 87.039,67
Lava Louça - Pronta Entrega;R$ 25.424;R$ 32.622,07;R$ 40.460,66;R$ 49.335,35;R$ 59.090,83
Lava Louça - Pré-venda;R$ 24.213;R$ 31.068,14;R$ 38.533,27;R$ 46.985,16;R$ 56.275,86
Simulador Escada TopStep - Pronta Entrega;R$ 1.800,00;R$ 1.162,97;R$ 469,26;-R$ 316,15;-R$ 1.179,51
Simulador Escada TopStep - Pré-venda;R$ 17.027,00;R$ 21.847,89;R$ 27.097,77;R$ 33.041,57;R$ 39.575,29
Simulador Escada TopStep K2 - Pronta Entrega;R$ 23.400,00;R$ 30.025,10;R$ 37.239,73;R$ 45.407,99;R$ 54.386,93
Simulador Escada TopStep K2 - Pré-venda;R$ 22.135,00;R$ 28.401,95;R$ 35.226,55;R$ 42.953,24;R$ 51.446,78
Esteira Ontrack - Pronta Entrega;R$ 24.000,00;R$ 30.794,97;R$ 38.194,59;R$ 46.572,30;R$ 55.781,47
Esteira Ontrack - Pré-venda;R$ 22.400,00;R$ 28.741,98;R$ 35.648,28;R$ 43.467,48;R$ 52.062,70
Esteira Ontrack S - Pronta Entrega;R$ 36.855,00;R$ 47.289,53;R$ 58.652,57;R$ 71.517,58;R$ 85.659,41
Esteira Ontrack S - Pré-venda;R$ 3.510,00;R$ 2.267,79;R$ 915,05;-R$ 616,50;-R$ 2.300,05
Esteira Ontrack X  - Pronta Entrega (SYT);R$ 22.761,00;R$ 29.205,25;R$ 36.222,94;R$ 44.168,24;R$ 52.902,08
Esteira Ontrack X  - Pré-venda (SYT);R$ 20.160,00;R$ 25.867,78;R$ 32.083,46;R$ 39.120,73;R$ 46.856,43
Esteira Ontrack K - Pronta Entrega (KP);R$ 25.613,00;R$ 32.864,51;R$ 40.761,29;R$ 49.701,87;R$ 59.529,78
Esteira Ontrack K - Pré-venda (KP);R$ 22.686,00;R$ 29.109,02;R$ 36.103,59;R$ 44.022,70;R$ 52.727,76
BIKE Vertical - Pronta Entrega (KP);R$ 7.742,00;R$ 9.934,09;R$ 12.321,23;R$ 15.023,92;R$ 17.994,83
BIKE Vertical - Pré-venda (KP);R$ 6.857,00;R$ 8.798,52;R$ 10.912,81;R$ 13.306,56;R$ 15.937,89
BIKE Horizontal - Pronta Entrega (KP);R$ 11.935,00;R$ 15.314,08;R$ 18.993,85;R$ 23.160,02;R$ 27.739,66
BIKE Horizontal - Pré-venda (KP);R$ 10.571,00;R$ 13.563,97;R$ 16.823,27;R$ 20.513,39;R$ 24.569,74
EZA - Sonora Hifu Kit Face;R$ 36.225,00;R$ 46.481,16;R$ 57.649,96;R$ 70.295,06;R$ 84.195,15
EZA - Sonora Hifu Kit Full - Face e Corpo;R$ 44.550,00;R$ 57.163,17;R$ 70.898,71;R$ 86.449,83;R$ 103.544,35
EZA - Sonora Hifu Kit Full Med;R$ 54.000,00;R$ 69.288,69;R$ 85.937,83;R$ 104.787,67;R$ 125.508,30
EZA - Emana - EMS Face;R$ 67.500,00;R$ 86.610,87;R$ 107.422,29;R$ 130.984,58;R$ 156.885,37
EZA - IzeFit - EMS;R$ 81.000,00;R$ 103.933,04;R$ 128.906,74;R$ 157.181,50;R$ 188.262,45
EZA - Raya - Laser Diodo;R$ 85.500,00;R$ 109.707,10;R$ 136.068,23;R$ 165.913,81;R$ 198.721,47
EZA - Podera - Laser Despigmentação;R$ 45.000,00;R$ 57.740,58;R$ 71.614,86;R$ 87.323,06;R$ 104.590,25
Bioset - MaxiShape Criostation;R$ 35.900,00;R$ 46.064,15;R$ 57.132,74;R$ 69.664,39;R$ 83.439,78
Bioset - MaxiFlash G3 + Clusters de LED;R$ 38.900,00;R$ 49.913,52;R$ 61.907,07;R$ 75.485,93;R$ 90.412,46
Bioset - KryoPlatten (Placas 1 P, 2M e 1G) + Ultrassom;R$ 40.900,00;R$ 52.479,77;R$ 65.089,95;R$ 79.366,96;R$ 95.060,91
Bioset - KryoPlatten (Placas 1 P, 2M e 1G) + Ultrassom + 2 Led;R$ 47.900,00;R$ 61.461,64;R$ 76.230,04;R$ 92.950,54;R$ 111.330,51
Bioset - KryoPlatten SE - Duas placas M;R$ 24.500,00;R$ 31.436,54;R$ 38.990,31;R$ 47.542,55;R$ 56.943,58
Bioset - Dermovac 2.1 + Cluster de Led;R$ 35.500,00;R$ 45.550,90;R$ 56.496,17;R$ 68.888,19;R$ 82.510,08
Bioset - OmniLight;R$ 89.000,00;R$ 114.198,03;R$ 141.638,28;R$ 172.705,60;R$ 206.856,27
Bioset - Plasmaskin;R$ 3.200,00;R$ 4.106,00;R$ 5.092,61;R$ 6.209,64;R$ 7.437,53
Bioset - LedShape;R$ 4.900,00;R$ 6.287,31;R$ 7.798,06;R$ 9.508,51;R$ 11.388,72
KLD - Manthus;R$ 14.500,00;R$ 18.605,30;R$ 23.075,90;R$ 28.137,43;R$ 33.701,30
KLD - Hertix;R$ 6.100,00;R$ 7.827,06;R$ 9.707,79;R$ 11.837,13;R$ 14.177,79
HTM - Light Pulse + Aplicador;R$ 42.000,00;R$ 57.740,58;R$ 71.614,86;R$ 87.323,06;R$ 104.590,25`;

const linhas = dadosTexto.trim().split('\n');
const cabecalhos = linhas[0].split(';');
const resultado = [];

for (let i = 1; i < linhas.length; i++) {
  const colunas = linhas[i].split(';');
  const equipamento = colunas[0].trim();

  for (let j = 1; j < colunas.length; j++) {
    resultado.push({
      equipamento: equipamento,
      forma_pagamento: cabecalhos[j].trim(),
      valor: parseFloat(colunas[j].replace('.', '').replace(',', '.'))
    });
  }
}

const jsonString = JSON.stringify(resultado, null, 2);
const blob = new Blob([jsonString], { type: 'application/json' });
const url = URL.createObjectURL(blob);

const a = document.createElement('a');
a.href = url;
a.download = 'valores-equipamentos.json';
a.click();
