var leafletDraw = require('leaflet-draw');
var React = require('react');
var ReactDOM = require('react-dom');

var osm,
    json,
    contentBox,
    text,
    layer,
    form,
    blank = [];

osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});

/*
** JSON
*/

json = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "id": 1,
                "name": "Moscow"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    37.606201171875,
                    55.77966236981707
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 2,
                "name": "Saint Petersburg"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    30.3662109375,
                    59.94950917225228
                ]
            }
        }
    ]
}

layer = L.geoJson(json, {
    onEachFeature: onEachFeature
});

function onEachFeature(feature) {
    var props = feature.properties;

    if (props) {
        blank.push(props);
    }
}


// temporaly expose map to global namespace
window.map = new L.Map('map', {layers: [osm, layer], center: new L.LatLng(50, 20), zoom: 3});

/*
 ** Temp prompt
  */
// form = document.getElementById('btn');
// form.onsubmit = function(e) {
//     e.preventDefault();

//     console.log(blank);
//     Table.setState({data:blank})
// }

/*
 ** Leaflet-draw
 */

 var drawControl = new L.Control.Draw({
     draw: {
         polygon: false,
         polyline: false,
         rectangle: false,
         circle: false
     },
     edit: {
         featureGroup: layer
     }
 });
 map.addControl(drawControl);


// console.log(leafletDraw);

/*
 ** React DOM rendering
 */

contentBox = document.getElementsByClassName('content')[0];

var Input = React.createClass({
    getInitialState: function() {
        return {data: blank};
    },
    handleInput: function(e) {
        e.preventDefault();
            blank.push({
                id: Math.ceil(Math.random() * 100),
                name: 'aaa'
            });
        this.setState({data: blank});
        console.log(e);
        console.log(this.state);
    },
    render: function() {
        return (
            <div>
                <form id="btn" onSubmit={this.handleInput}>
                    <input type="input"></input>
                    <input type="submit" value="click"></input>
                </form>
                <Table data={this.state.data}/>
            </div>
        );
    }
});

var Table = React.createClass({
    render: function() {
        var rows = this.props.data.map(function(row){
            return (
                <Row key={row.id} name={row.name}/>
            )
        })
        return (
            <table>
                <tbody>{rows}</tbody>
            </table>
        );
    }
});


var Row = React.createClass({
    render: function () {
        return (
            <tr>
                <td>{this.props.id}</td>
                <td>{this.props.name}</td>
            </tr>
        );
    }
});

ReactDOM.render(
    // React.createElement(text),
    <Input data={blank}/>,
    contentBox
)
