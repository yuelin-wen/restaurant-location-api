
/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ______Yuelin Wen________________ Student ID: ____114379209______________ Date: _____2021-06-06_______________
*
*
********************************************************************************/

var restaurantData = [];
var currentRestaurant = {};
var page = 1;
const perPage = 10;
var map = null;

function avg(grades) {
    let total = 0;
    grades.forEach(i => {
        total += i.score;
    });
    return (total / grades.length).toFixed(2);
};

const tableRows = _.template(`
    <% _.forEach(restaurants, function(data){ %>
        <tr data-id=<%- data._id %>>
            <td><%- data.name %></td>
            <td><%- data.cuisine %></td>
            <td><%- data.address.building + " " + data.address.street %></td>
            <td><%- avg(data.grades) %></td>
        </tr>
        <% }); %>`
);

function loadRestaurantData() {
    fetch(`https://frozen-hamlet-75254.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`)
        .then(res => res.json())
        .then((data) => {
            restaurantData = data;
            let dataSet = tableRows({ restaurants: data });
            $("#restaurant-table tbody").html(dataSet);
            $("#current-page").html(page);
        })
        .catch(err => {
            console.log(err);
        })
};

$(function () {
    loadRestaurantData();
    //5 events
    //1.Click event for all tr elements within the tbody of the restaurant-table
    $("#restaurant-table tbody").on("click", "tr", function () {
        var data_id = $(this).attr("data-id");
        restaurantData.forEach(element => {
            if (data_id == element._id) {
                currentRestaurant = _.cloneDeep(element);
            }
        });
        $("#restaurant-modal .modal-title").html(currentRestaurant.name);
        $("#restaurant-address").html(`${currentRestaurant.address.building} ${currentRestaurant.address.street}`);
        $(`#restaurant-modal`).modal('show');
    });
    //2.Click event for the "previous page" pagination button
    $("#previous-page").on("click", function () {
        if (page > 1) {
            page--;
            loadRestaurantData();
        }
    });
    //3.Click event for the "next page" pagination button
    $("#next-page").on("click", function () {
        page++;
        loadRestaurantData();
    });
    //4.shown.bs.modal event for the "Restaurant" modal window
    $('#restaurant-modal').on('shown.bs.modal', function () {
        map = new L.Map('leaflet', {
            center: [
                currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]
            ],
            zoom: 18,
            layers: [
                new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
            ]
        });
        L.marker([currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]]).addTo(map);
    });
    //5.hidden.bs.modal event for the "Restaurant" modal window
    $('#restaurant-modal').on('hidden.bs.modal', function () {
        map.remove();
    });

})
