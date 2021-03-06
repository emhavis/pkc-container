/*==================================================
 *  Japanese Era Date Labeller
 *==================================================
 */

Timeline.JapaneseEraDateLabeller = function(locale, timeZone, useRomanizedName) {
    var o = new Timeline.GregorianDateLabeller(locale, timeZone);

    o._useRomanizedName = (useRomanizedName);
    o._oldLabelInterval = o.labelInterval;
    o.labelInterval = Timeline.JapaneseEraDateLabeller._labelInterval;

    return o;
};

Timeline.JapaneseEraDateLabeller._labelInterval = function(date, intervalUnit) {
    var text;
    var emphasized = false;

    var date2 = Timeline.DateTime.removeTimeZoneOffset(date, this._timeZone);

    switch(intervalUnit) {
    case Timeline.DateTime.YEAR:
    case Timeline.DateTime.DECADE:
    case Timeline.DateTime.CENTURY:
    case Timeline.DateTime.MILLENNIUM:
        var y = date2.getUTCFullYear();
        if (y >= Timeline.JapaneseEraDateLabeller._eras.elementAt(0).startingYear) {
            var eraIndex = Timeline.JapaneseEraDateLabeller._eras.find(function(era) {
                    return era.startingYear - y;
                }
            );
            if (eraIndex < Timeline.JapaneseEraDateLabeller._eras.length()) {
                var era = Timeline.JapaneseEraDateLabeller._eras.elementAt(eraIndex);
                if (y < era.startingYear) {
                    era = Timeline.JapaneseEraDateLabeller._eras.elementAt(eraIndex - 1);
                }
            } else {
                var era = Timeline.JapaneseEraDateLabeller._eras.elementAt(eraIndex - 1);
            }

            text = (this._useRomanizedName ? era.romanizedName : era.japaneseName) + " " + (y - era.startingYear + 1);
            emphasized = intervalUnit == Timeline.DateTime.YEAR && y == era.startingYear;
            break;
        } // else, fall through
    default:
        return this._oldLabelInterval(date, intervalUnit);
    }

    return { text: text, emphasized: emphasized };
};

/*==================================================
 *  Japanese Era Ether Painter
 *==================================================
 */

Timeline.JapaneseEraEtherPainter = function(params, band, timeline) {
    this._params = params;
    this._theme = params.theme;
};

Timeline.JapaneseEraEtherPainter.prototype.initialize = function(band, timeline) {
    this._band = band;
    this._timeline = timeline;

    this._backgroundLayer = band.createLayerDiv(0);
    this._backgroundLayer.setAttribute("name", "ether-background"); // for debugging
    this._backgroundLayer.style.background = this._theme.ether.backgroundColors[band.getIndex()];

    this._markerLayer = null;
    this._lineLayer = null;

    var align = ("align" in this._params) ? this._params.align :
        this._theme.ether.interval.marker[timeline.isHorizontal() ? "hAlign" : "vAlign"];
    var showLine = ("showLine" in this._params) ? this._params.showLine :
        this._theme.ether.interval.line.show;

    this._intervalMarkerLayout = new Timeline.EtherIntervalMarkerLayout(
        this._timeline, this._band, this._theme, align, showLine);

    this._highlight = new Timeline.EtherHighlight(
        this._timeline, this._band, this._theme, this._backgroundLayer);
}

Timeline.JapaneseEraEtherPainter.prototype.setHighlight = function(startDate, endDate) {
    this._highlight.position(startDate, endDate);
}

Timeline.JapaneseEraEtherPainter.prototype.paint = function() {
    if (this._markerLayer) {
        this._band.removeLayerDiv(this._markerLayer);
    }
    this._markerLayer = this._band.createLayerDiv(100);
    this._markerLayer.setAttribute("name", "ether-markers"); // for debugging
    this._markerLayer.style.display = "none";

    if (this._lineLayer) {
        this._band.removeLayerDiv(this._lineLayer);
    }
    this._lineLayer = this._band.createLayerDiv(1);
    this._lineLayer.setAttribute("name", "ether-lines"); // for debugging
    this._lineLayer.style.display = "none";

    var minYear = this._band.getMinDate().getUTCFullYear();
    var maxYear = this._band.getMaxDate().getUTCFullYear();
    var eraIndex = Timeline.JapaneseEraDateLabeller._eras.find(function(era) {
            return era.startingYear - minYear;
        }
    );

    var l = Timeline.JapaneseEraDateLabeller._eras.length();
    for (var i = eraIndex; i < l; i++) {
        var era = Timeline.JapaneseEraDateLabeller._eras.elementAt(i);
        if (era.startingYear > maxYear) {
            break;
        }

        var d = new Date(0);
        d.setUTCFullYear(era.startingYear);

        var labeller = {
            labelInterval: function(date, intervalUnit) {
                return {
                    text: era.japaneseName,
                    emphasized: true
                };
            }
        };

        this._intervalMarkerLayout.createIntervalMarker(
            d, labeller, Timeline.DateTime.YEAR, this._markerLayer, this._lineLayer);
    }
    this._markerLayer.style.display = "block";
    this._lineLayer.style.display = "block";
};

Timeline.JapaneseEraEtherPainter.prototype.softPaint = function() {
};


Timeline.JapaneseEraDateLabeller._eras = new Timeline.SortedArray(
    function(e1, e2) {
        return e1.startingYear - e2.startingYear;
    },
    [
        { startingYear: 645, japaneseName: '??????', romanizedName: "Taika" },
        { startingYear: 650, japaneseName: '??????', romanizedName: "Hakuchi" },
        { startingYear: 686, japaneseName: '??????', romanizedName: "Shuch??" },
        { startingYear: 701, japaneseName: '??????', romanizedName: "Taih??" },
        { startingYear: 704, japaneseName: '??????', romanizedName: "Keiun" },
        { startingYear: 708, japaneseName: '??????', romanizedName: "Wad??" },
        { startingYear: 715, japaneseName: '??????', romanizedName: "Reiki" },
        { startingYear: 717, japaneseName: '??????', romanizedName: "Y??r??" },
        { startingYear: 724, japaneseName: '??????', romanizedName: "Jinki" },
        { startingYear: 729, japaneseName: '??????', romanizedName: "Tenpy??" },
        { startingYear: 749, japaneseName: '????????????', romanizedName: "Tenpy??-kanp??" },
        { startingYear: 749, japaneseName: '????????????', romanizedName: "Tenpy??-sh??h??" },
        { startingYear: 757, japaneseName: '????????????', romanizedName: "Tenpy??-h??ji" },
        { startingYear: 765, japaneseName: '????????????', romanizedName: "Tenpy??-jingo" },
        { startingYear: 767, japaneseName: '????????????', romanizedName: "Jingo-keiun" },
        { startingYear: 770, japaneseName: '??????', romanizedName: "H??ki" },
        { startingYear: 781, japaneseName: '??????', romanizedName: "Ten'??" },
        { startingYear: 782, japaneseName: '??????', romanizedName: "Enryaku" },
        { startingYear: 806, japaneseName: '??????', romanizedName: "Daid??" },
        { startingYear: 810, japaneseName: '??????', romanizedName: "K??nin" },
        { startingYear: 824, japaneseName: '??????', romanizedName: "Tench??" },
        { startingYear: 834, japaneseName: '??????', romanizedName: "J??wa" },
        { startingYear: 848, japaneseName: '??????', romanizedName: "Kaj??" },
        { startingYear: 851, japaneseName: '??????', romanizedName: "Ninju" },
        { startingYear: 854, japaneseName: '??????', romanizedName: "Saik??" },
        { startingYear: 857, japaneseName: '??????', romanizedName: "Tennan" },
        { startingYear: 859, japaneseName: '??????', romanizedName: "J??gan" },
        { startingYear: 877, japaneseName: '??????', romanizedName: "Gangy??" },
        { startingYear: 885, japaneseName: '??????', romanizedName: "Ninna" },
        { startingYear: 889, japaneseName: '??????', romanizedName: "Kanpy??" },
        { startingYear: 898, japaneseName: '??????', romanizedName: "Sh??tai" },
        { startingYear: 901, japaneseName: '??????', romanizedName: "Engi" },
        { startingYear: 923, japaneseName: '??????', romanizedName: "Ench??" },
        { startingYear: 931, japaneseName: '??????', romanizedName: "J??hei" },
        { startingYear: 938, japaneseName: '??????', romanizedName: "Tengy??" },
        { startingYear: 947, japaneseName: '??????', romanizedName: "Tenryaku" },
        { startingYear: 957, japaneseName: '??????', romanizedName: "Tentoku" },
        { startingYear: 961, japaneseName: '??????', romanizedName: "??wa" },
        { startingYear: 964, japaneseName: '??????', romanizedName: "K??h??" },
        { startingYear: 968, japaneseName: '??????', romanizedName: "Anna" },
        { startingYear: 970, japaneseName: '??????', romanizedName: "Tenroku" },
        { startingYear: 973, japaneseName: '??????', romanizedName: "Ten'en" },
        { startingYear: 976, japaneseName: '??????', romanizedName: "J??gen" },
        { startingYear: 978, japaneseName: '??????', romanizedName: "Tengen" },
        { startingYear: 983, japaneseName: '??????', romanizedName: "Eikan" },
        { startingYear: 985, japaneseName: '??????', romanizedName: "Kanna" },
        { startingYear: 987, japaneseName: '??????', romanizedName: "Eien" },
        { startingYear: 988, japaneseName: '??????', romanizedName: "Eiso" },
        { startingYear: 990, japaneseName: '??????', romanizedName: "Sh??ryaku" },
        { startingYear: 995, japaneseName: '??????', romanizedName: "Ch??toku" },
        { startingYear: 999, japaneseName: '??????', romanizedName: "Ch??h??" },
        { startingYear: 1004, japaneseName: '??????', romanizedName: "Kank??" },
        { startingYear: 1012, japaneseName: '??????', romanizedName: "Ch??wa" },
        { startingYear: 1017, japaneseName: '??????', romanizedName: "Kannin" },
        { startingYear: 1021, japaneseName: '??????', romanizedName: "Jian" },
        { startingYear: 1024, japaneseName: '??????', romanizedName: "Manju" },
        { startingYear: 1028, japaneseName: '??????', romanizedName: "Ch??gen" },
        { startingYear: 1037, japaneseName: '??????', romanizedName: "Ch??ryaku" },
        { startingYear: 1040, japaneseName: '??????', romanizedName: "Ch??ky??" },
        { startingYear: 1044, japaneseName: '??????', romanizedName: "Kantoku" },
        { startingYear: 1046, japaneseName: '??????', romanizedName: "Eish??" },
        { startingYear: 1053, japaneseName: '??????', romanizedName: "Tengi" },
        { startingYear: 1058, japaneseName: '??????', romanizedName: "K??hei" },
        { startingYear: 1065, japaneseName: '??????', romanizedName: "Jiryaku" },
        { startingYear: 1069, japaneseName: '??????', romanizedName: "Enky??" },
        { startingYear: 1074, japaneseName: '??????', romanizedName: "J??h??" },
        { startingYear: 1077, japaneseName: '??????', romanizedName: "J??ryaku" },
        { startingYear: 1081, japaneseName: '??????', romanizedName: "Eih??" },
        { startingYear: 1084, japaneseName: '??????', romanizedName: "??toku" },
        { startingYear: 1087, japaneseName: '??????', romanizedName: "Kanji" },
        { startingYear: 1094, japaneseName: '??????', romanizedName: "Kah??" },
        { startingYear: 1096, japaneseName: '??????', romanizedName: "Eich??" },
        { startingYear: 1097, japaneseName: '??????', romanizedName: "J??toku" },
        { startingYear: 1099, japaneseName: '??????', romanizedName: "K??wa" },
        { startingYear: 1104, japaneseName: '??????', romanizedName: "Ch??ji" },
        { startingYear: 1106, japaneseName: '??????', romanizedName: "Kaj??" },
        { startingYear: 1108, japaneseName: '??????', romanizedName: "Tennin" },
        { startingYear: 1110, japaneseName: '??????', romanizedName: "Ten'ei" },
        { startingYear: 1113, japaneseName: '??????', romanizedName: "Eiky??" },
        { startingYear: 1118, japaneseName: '??????', romanizedName: "Gen'ei" },
        { startingYear: 1120, japaneseName: '??????', romanizedName: "H??an" },
        { startingYear: 1124, japaneseName: '??????', romanizedName: "Tenji" },
        { startingYear: 1126, japaneseName: '??????', romanizedName: "Daiji" },
        { startingYear: 1131, japaneseName: '??????', romanizedName: "Tensh??" },
        { startingYear: 1132, japaneseName: '??????', romanizedName: "Ch??sh??" },
        { startingYear: 1135, japaneseName: '??????', romanizedName: "H??en" },
        { startingYear: 1141, japaneseName: '??????', romanizedName: "Eiji" },
        { startingYear: 1142, japaneseName: '??????', romanizedName: "K??ji" },
        { startingYear: 1144, japaneseName: '??????', romanizedName: "Ten'y??" },
        { startingYear: 1145, japaneseName: '??????', romanizedName: "Ky??an" },
        { startingYear: 1151, japaneseName: '??????', romanizedName: "Ninpei" },
        { startingYear: 1154, japaneseName: '??????', romanizedName: "Ky??ju" },
        { startingYear: 1156, japaneseName: '??????', romanizedName: "H??gen" },
        { startingYear: 1159, japaneseName: '??????', romanizedName: "Heiji" },
        { startingYear: 1160, japaneseName: '??????', romanizedName: "Eiryaku" },
        { startingYear: 1161, japaneseName: '??????', romanizedName: "??h??" },
        { startingYear: 1163, japaneseName: '??????', romanizedName: "Ch??kan" },
        { startingYear: 1165, japaneseName: '??????', romanizedName: "Eiman" },
        { startingYear: 1166, japaneseName: '??????', romanizedName: "Ninnan" },
        { startingYear: 1169, japaneseName: '??????', romanizedName: "Ka??" },
        { startingYear: 1171, japaneseName: '??????', romanizedName: "J??an" },
        { startingYear: 1175, japaneseName: '??????', romanizedName: "Angen" },
        { startingYear: 1177, japaneseName: '??????', romanizedName: "Jish??" },
        { startingYear: 1181, japaneseName: '??????', romanizedName: "Y??wa" },
        { startingYear: 1182, japaneseName: '??????', romanizedName: "Juei" },
        { startingYear: 1184, japaneseName: '??????', romanizedName: "Genryaku" },
        { startingYear: 1185, japaneseName: '??????', romanizedName: "Bunji" },
        { startingYear: 1190, japaneseName: '??????', romanizedName: "Kenky??" },
        { startingYear: 1199, japaneseName: '??????', romanizedName: "Sh??ji" },
        { startingYear: 1201, japaneseName: '??????', romanizedName: "Kennin" },
        { startingYear: 1204, japaneseName: '??????', romanizedName: "Genky??" },
        { startingYear: 1206, japaneseName: '??????', romanizedName: "Ken'ei" },
        { startingYear: 1207, japaneseName: '??????', romanizedName: "J??gen" },
        { startingYear: 1211, japaneseName: '??????', romanizedName: "Kenryaku" },
        { startingYear: 1213, japaneseName: '??????', romanizedName: "Kenp??" },
        { startingYear: 1219, japaneseName: '??????', romanizedName: "J??ky??" },
        { startingYear: 1222, japaneseName: '??????', romanizedName: "J????" },
        { startingYear: 1224, japaneseName: '??????', romanizedName: "Gennin" },
        { startingYear: 1225, japaneseName: '??????', romanizedName: "Karoku" },
        { startingYear: 1227, japaneseName: '??????', romanizedName: "Antei" },
        { startingYear: 1229, japaneseName: '??????', romanizedName: "Kanki" },
        { startingYear: 1232, japaneseName: '??????', romanizedName: "J??ei" },
        { startingYear: 1233, japaneseName: '??????', romanizedName: "Tenpuku" },
        { startingYear: 1234, japaneseName: '??????', romanizedName: "Bunryaku" },
        { startingYear: 1235, japaneseName: '??????', romanizedName: "Katei" },
        { startingYear: 1238, japaneseName: '??????', romanizedName: "Ryakunin" },
        { startingYear: 1239, japaneseName: '??????', romanizedName: "En'??" },
        { startingYear: 1240, japaneseName: '??????', romanizedName: "Ninji" },
        { startingYear: 1243, japaneseName: '??????', romanizedName: "Kangen" },
        { startingYear: 1247, japaneseName: '??????', romanizedName: "H??ji" },
        { startingYear: 1249, japaneseName: '??????', romanizedName: "Kench??" },
        { startingYear: 1256, japaneseName: '??????', romanizedName: "K??gen" },
        { startingYear: 1257, japaneseName: '??????', romanizedName: "Sh??ka" },
        { startingYear: 1259, japaneseName: '??????', romanizedName: "Sh??gen" },
        { startingYear: 1260, japaneseName: '??????', romanizedName: "Bun'??" },
        { startingYear: 1261, japaneseName: '??????', romanizedName: "K??cho" },
        { startingYear: 1264, japaneseName: '??????', romanizedName: "Bun'ei" },
        { startingYear: 1275, japaneseName: '??????', romanizedName: "Kenji" },
        { startingYear: 1278, japaneseName: '??????', romanizedName: "K??an" },
        { startingYear: 1288, japaneseName: '??????', romanizedName: "Sh????" },
        { startingYear: 1293, japaneseName: '??????', romanizedName: "Einin" },
        { startingYear: 1299, japaneseName: '??????', romanizedName: "Sh??an" },
        { startingYear: 1302, japaneseName: '??????', romanizedName: "Kengen" },
        { startingYear: 1303, japaneseName: '??????', romanizedName: "Kagen" },
        { startingYear: 1306, japaneseName: '??????', romanizedName: "Tokuji" },
        { startingYear: 1308, japaneseName: '??????', romanizedName: "Enkei" },
        { startingYear: 1311, japaneseName: '??????', romanizedName: "??ch??" },
        { startingYear: 1312, japaneseName: '??????', romanizedName: "Sh??wa" },
        { startingYear: 1317, japaneseName: '??????', romanizedName: "Bunp??" },
        { startingYear: 1319, japaneseName: '??????', romanizedName: "Gen'??" },
        { startingYear: 1321, japaneseName: '??????', romanizedName: "Genky??" },
        { startingYear: 1324, japaneseName: '??????', romanizedName: "Sh??ch??" },
        { startingYear: 1326, japaneseName: '??????', romanizedName: "Karyaku" },
        { startingYear: 1329, japaneseName: '??????', romanizedName: "Gentoku" },
        { startingYear: 1331, japaneseName: '??????', romanizedName: "Genk??" },
        { startingYear: 1334, japaneseName: '??????', romanizedName: "Kenmu" },
        { startingYear: 1336, japaneseName: '??????', romanizedName: "Engen" },
        { startingYear: 1340, japaneseName: '??????', romanizedName: "K??koku" },
        { startingYear: 1346, japaneseName: '??????', romanizedName: "Sh??hei" },
        { startingYear: 1370, japaneseName: '??????', romanizedName: "Kentoku" },
        { startingYear: 1372, japaneseName: '??????', romanizedName: "Bunch??" },
        { startingYear: 1375, japaneseName: '??????', romanizedName: "Tenju" },
        { startingYear: 1381, japaneseName: '??????', romanizedName: "K??wa" },
        { startingYear: 1384, japaneseName: '??????', romanizedName: "Gench??" },
        { startingYear: 1332, japaneseName: '??????', romanizedName: "Sh??kei" },
        { startingYear: 1338, japaneseName: '??????', romanizedName: "Ryaku??" },
        { startingYear: 1342, japaneseName: '??????', romanizedName: "K??ei" },
        { startingYear: 1345, japaneseName: '??????', romanizedName: "J??wa" },
        { startingYear: 1350, japaneseName: '??????', romanizedName: "Kan'??" },
        { startingYear: 1352, japaneseName: '??????', romanizedName: "Bunna" },
        { startingYear: 1356, japaneseName: '??????', romanizedName: "Enbun" },
        { startingYear: 1361, japaneseName: '??????', romanizedName: "K??an" },
        { startingYear: 1362, japaneseName: '??????', romanizedName: "J??ji" },
        { startingYear: 1368, japaneseName: '??????', romanizedName: "??an" },
        { startingYear: 1375, japaneseName: '??????', romanizedName: "Eiwa" },
        { startingYear: 1379, japaneseName: '??????', romanizedName: "K??ryaku" },
        { startingYear: 1381, japaneseName: '??????', romanizedName: "Eitoku" },
        { startingYear: 1384, japaneseName: '??????', romanizedName: "Shitoku" },
        { startingYear: 1387, japaneseName: '??????', romanizedName: "Kakei" },
        { startingYear: 1389, japaneseName: '??????', romanizedName: "K????" },
        { startingYear: 1390, japaneseName: '??????', romanizedName: "Meitoku" },
        { startingYear: 1394, japaneseName: '??????', romanizedName: "??ei" },
        { startingYear: 1428, japaneseName: '??????', romanizedName: "Sh??ch??" },
        { startingYear: 1429, japaneseName: '??????', romanizedName: "Eiky??" },
        { startingYear: 1441, japaneseName: '??????', romanizedName: "Kakitsu" },
        { startingYear: 1444, japaneseName: '??????', romanizedName: "Bunnan" },
        { startingYear: 1449, japaneseName: '??????', romanizedName: "H??toku" },
        { startingYear: 1452, japaneseName: '??????', romanizedName: "Ky??toku" },
        { startingYear: 1455, japaneseName: '??????', romanizedName: "K??sh??" },
        { startingYear: 1457, japaneseName: '??????', romanizedName: "Ch??roku" },
        { startingYear: 1460, japaneseName: '??????', romanizedName: "Kansh??" },
        { startingYear: 1466, japaneseName: '??????', romanizedName: "Bunsh??" },
        { startingYear: 1467, japaneseName: '??????', romanizedName: "??nin" },
        { startingYear: 1469, japaneseName: '??????', romanizedName: "Bunmei" },
        { startingYear: 1487, japaneseName: '??????', romanizedName: "Ch??ky??" },
        { startingYear: 1489, japaneseName: '??????', romanizedName: "Entoku" },
        { startingYear: 1492, japaneseName: '??????', romanizedName: "Mei??" },
        { startingYear: 1501, japaneseName: '??????', romanizedName: "Bunki" },
        { startingYear: 1504, japaneseName: '??????', romanizedName: "Eish??" },
        { startingYear: 1521, japaneseName: '??????', romanizedName: "Daiei" },
        { startingYear: 1528, japaneseName: '??????', romanizedName: "Ky??roku" },
        { startingYear: 1532, japaneseName: '??????', romanizedName: "Tenbun" },
        { startingYear: 1555, japaneseName: '??????', romanizedName: "K??ji" },
        { startingYear: 1558, japaneseName: '??????', romanizedName: "Eiroku" },
        { startingYear: 1570, japaneseName: '??????', romanizedName: "Genki" },
        { startingYear: 1573, japaneseName: '??????', romanizedName: "Tensh??" },
        { startingYear: 1592, japaneseName: '??????', romanizedName: "Bunroku" },
        { startingYear: 1596, japaneseName: '??????', romanizedName: "Keich??" },
        { startingYear: 1615, japaneseName: '??????', romanizedName: "Genna" },
        { startingYear: 1624, japaneseName: '??????', romanizedName: "Kan'ei" },
        { startingYear: 1644, japaneseName: '??????', romanizedName: "Sh??h??" },
        { startingYear: 1648, japaneseName: '??????', romanizedName: "Keian" },
        { startingYear: 1652, japaneseName: '??????', romanizedName: "J????" },
        { startingYear: 1655, japaneseName: '??????', romanizedName: "Meireki" },
        { startingYear: 1658, japaneseName: '??????', romanizedName: "Manji" },
        { startingYear: 1661, japaneseName: '??????', romanizedName: "Kanbun" },
        { startingYear: 1673, japaneseName: '??????', romanizedName: "Enp??" },
        { startingYear: 1681, japaneseName: '??????', romanizedName: "Tenna" },
        { startingYear: 1684, japaneseName: '??????', romanizedName: "J??ky??" },
        { startingYear: 1688, japaneseName: '??????', romanizedName: "Genroku" },
        { startingYear: 1704, japaneseName: '??????', romanizedName: "H??ei" },
        { startingYear: 1711, japaneseName: '??????', romanizedName: "Sh??toku" },
        { startingYear: 1716, japaneseName: '??????', romanizedName: "Ky??h??" },
        { startingYear: 1736, japaneseName: '??????', romanizedName: "Genbun" },
        { startingYear: 1741, japaneseName: '??????', romanizedName: "Kanp??" },
        { startingYear: 1744, japaneseName: '??????', romanizedName: "Enky??" },
        { startingYear: 1748, japaneseName: '??????', romanizedName: "Kan'en" },
        { startingYear: 1751, japaneseName: '??????', romanizedName: "H??reki" },
        { startingYear: 1764, japaneseName: '??????', romanizedName: "Meiwa" },
        { startingYear: 1772, japaneseName: '??????', romanizedName: "An'ei" },
        { startingYear: 1781, japaneseName: '??????', romanizedName: "Tenmei" },
        { startingYear: 1789, japaneseName: '??????', romanizedName: "Kansei" },
        { startingYear: 1801, japaneseName: '??????', romanizedName: "Ky??wa" },
        { startingYear: 1804, japaneseName: '??????', romanizedName: "Bunka" },
        { startingYear: 1818, japaneseName: '??????', romanizedName: "Bunsei" },
        { startingYear: 1830, japaneseName: '??????', romanizedName: "Tenp??" },
        { startingYear: 1844, japaneseName: '??????', romanizedName: "K??ka" },
        { startingYear: 1848, japaneseName: '??????', romanizedName: "Kaei" },
        { startingYear: 1854, japaneseName: '??????', romanizedName: "Ansei" },
        { startingYear: 1860, japaneseName: '??????', romanizedName: "Man'en" },
        { startingYear: 1861, japaneseName: '??????', romanizedName: "Bunky??" },
        { startingYear: 1864, japaneseName: '??????', romanizedName: "Genji" },
        { startingYear: 1865, japaneseName: '??????', romanizedName: "Kei??" },
        { startingYear: 1868, japaneseName: '??????', romanizedName: "Meiji" },
        { startingYear: 1912, japaneseName: '??????', romanizedName: "Taish??" },
        { startingYear: 1926, japaneseName: '??????', romanizedName: "Sh??wa" },
        { startingYear: 1989, japaneseName: '??????', romanizedName: "Heisei" }
    ]
);
