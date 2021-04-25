//creates the matrix elements for 2D density plots
function create_matrix_density(div, dims , chosen_algs){

  var rows = 1;
  var columns = 1;
  if (!(chosen_algs.length == columns * rows)) {
    while (chosen_algs.length >= columns * rows) {
      columns++;
      if (chosen_algs.length >= columns * rows) {
        break
      }
      else {
        rows++;
        if (chosen_algs.length >= columns * rows) {
          break
        }
      }
    }
  }

  let temp_rows = '';
  let temp_columns = '';

  //if it has more than 1 algorithm needs to create the matrix else it's a normal density plot

  if (columns * rows != 1) {
    if (div.parentNode.parentNode.querySelector('.hypervolumes_list')) {
      div.parentNode.parentNode.querySelector('.hypervolumes_list').remove();
    }

    var graphs_content = div.parentNode;

    div.remove();

    let density_matrix = document.createElement('div');
    density_matrix.classList.add('density_matrix');

    for (var i = 0; i < rows; i++) {
      temp_rows += '360px '
    }

    for (var i = 0; i < columns; i++) {
      temp_columns += '360px '
    }

    density_matrix.style.gridTemplateColumns = temp_columns;
    density_matrix.style.gridTemplateRows = temp_rows;

    chosen_algs.forEach((algorithm) => {
      let graphmatrix = document.createElement('div')
      graphmatrix.classList.add('graphmatrix');
      graphmatrix.id = algorithm;
      console.log(graphmatrix);

      density_matrix.appendChild(graphmatrix);

      twoDimDensityPlot_4_matrix(graphmatrix, dims, [algorithm])

    });

    graphs_content.appendChild(density_matrix);
    create_diference_modal(density_matrix);
  }
  else {
    twoDimDensityPlot(div, dims, chosen_algs)
  }

}
function create_diference_modal(div){
  let graphs_content = div.parentNode;

  let diference_button = document.createElement('span');
  diference_button.classList.add('diference_button');
  diference_button.innerHTML = 'View diference between algorithms';


  graphs_content.appendChild(diference_button);

  diference_button.addEventListener('click' , e => {

    var diference_modal = document.createElement('div');
    diference_modal.classList.add('diference_modal');
    diference_modal.style = 'display:none;';

    var diference_modal_content = document.createElement('div');
    diference_modal_content.classList.add('diference_modal_content');

    diference_modal.appendChild(diference_modal_content);
    graphs_content.appendChild(diference_modal)

    //create close button
    var close = document.createElement('span');
    close.classList.add('close_modal')
    close.innerHTML = '+';
    add_close_listener(close)
    diference_modal_content.appendChild(close);

    let children = div.childNodes;

    children.forEach((child) => {
      console.log(child.id);
      console.log(child.data[0].x);
      console.log(child.data[0].y);

      console.log(calculate_density(child.data[0].x,child.data[0].y));

      child.once('plotly_click',
        function(data){
          console.log(data.points[0].x);
        });
      // let
    });



  });
}

function calculate_density(x_values,y_values){
  var densities = []
  for (var i = 0; i < x_values.length; i++) {
    let x = x_values[i];
    let y = y_values[i];

    let coordenate = [x,y];

    if (densities.length == 0) {
      densities.push([coordenate,1])
    }
    else {
      for (var j= 0; j < density.length; j++) {
        var founded = false;
        if(densities[j][0] == coordenate){
          founded = true;
          densities[j][1] += 1
          break;
        }
      }
      if (!founded) {
        densities.push([coordenate,1])
      }
    }
  }
  return densities
}

//Plotly bug that the graphs don't get created with the div's size unless it's told so
function twoDimDensityPlot_4_matrix(div, dims, chosen_algs){
  algIndex1 = Algorithms_names.indexOf(chosen_algs[0]);
  dim_index1 = Dimensions_names.indexOf(dims[0])
  dim_index2 = Dimensions_names.indexOf(dims[1])
  alg1 = Algorithms_data[algIndex1]

  var trace1 = {
    x: alg1[dim_index1],
    y: alg1[dim_index2],
    name: 'density',
    ncontours: 20,
    colorscale: 'Hot',
    reversescale: true,
    showscale: false,
    type: 'histogram2dcontour'
  };
  var data = [trace1];
  var layout = {
    width:360, // matrix div size
    height:360,
    showlegend: false,
    autosize: true,
    margin: {
        l: 50,
        r: 0,
        b: 50,
        t: 0
    },
    hovermode: 'closest',
    bargap: 0,
    xaxis: {
      title: dims[0],
      domain: [0, 0.85],
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      title: dims[1],
      domain: [0, 0.85],
      showgrid: false,
      zeroline: false
    },

  };
  Plotly.newPlot(div, data, layout);
}
