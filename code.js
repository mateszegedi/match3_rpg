//create variables for latter use 
  let canvas;
  let context;
  let img;
  let frame_width = 16;
  let frame_height = 16;
  let sprite_width = 32;
  let sprite_height = 32;
  let sprite_types = 
    [
      {color:"red",
      sprite_column: 3,
      sprite_row: 3
      },
      {color:"yellow",
      sprite_column: 6,
      sprite_row: 3
      },
      {color:"green",
      sprite_column: 8,
      sprite_row: 3
      },
      {color:"placeholder",
      sprite_column: 0,
      sprite_row: 0
      },
      {color:"blue",
      sprite_column: 12,
      sprite_row: 3
      }
  ];
  // we do not want to use a smaller set of colors for our drawing purposes
  let valid_colors = ["red"
                      ,"yellow"
                      ,"green"
                      ,"blue"]
  //size of the map in columns and rows
  let no_columns = 7;
  let no_rows = 7;
  let blocks = [];
  
  
window.onload = init;
function init(){
  // Get a reference to the canvas
  canvas = document.getElementById('game_area');
  context = canvas.getContext('2d');
  img = new Image();
  img.src = "potions.png";
  //start game loop - e.g  the core of the game
  window.requestAnimationFrame(game_loop);
  //draw();
}

//this is the main function, which checks,
// constantly all actions, draws the animations
// .etc
function game_loop(timestamp){
  window.requestAnimationFrame(game_loop);
}

function start_game(){
  context.clearRect(0,0,canvas.width,canvas.height);
  context.beginPath();
  generate_map();
}

function generate_map(){
  blocks = [];
  //make a map dynamically
  for (let i=0;i<no_rows;i++) {
    blocks.push([]);
    for (let j=0;j<no_columns;j++) {
    //pick a colour randomly
    random_color = Math.floor(Math.random() * sprite_types.length);
    //create a new sprite with this color
    blocks[i].push(new block(false,i,j,sprite_types[random_color]["color"]));
    blocks[i][j].draw_sprite();
    }
  }
}

function check_matches(){
  /*this check loops through the blocks
  and checks if a match of three from the
  same colour are horizontally or vertically
  adjacent. If yes, print it to console log.
  For starters, I care only about match of 3
  */
  for (let i=0;i<no_rows;i++) {
    for (let j=0;j<no_columns;j++) {
      /*todo: only make this checks
      if there is  a valid blocks[i][j] 
      so - corners: no checks
      - first/last row: only horizontal check
      - first/last column: only vertical check
      - else: both horizontal and vertical
      check
      also make separate functions for vertical
      and horizontal checks and pass only 
      i,j into it
      */
      //if cordinates are corner blocks
      if (
          (i == 0 && j == 0)
        || (i == 0 && j == no_columns-1)
        || (i == no_rows-1 && j == 0)
        || (i == no_rows-1 && j == no_columns-1)
        )
          {
            //currently we do not do anything
            continue;
          }
        //if coordinates are first or last row
      else if (
          (i == 0 && j != 0)
        || (i == no_rows-1 && j != no_columns-1)
        )
          {
            // check only vertically, if
            // there are 3 adjacent match blocks
            if (h_3match(i,j)==true){
              console.log("There is a match at row " + String(i) + " to " + String(i) + " and  at column "+ String(j-1) +" to "+ String(j+1))
            }
          }
      //if coordinates are first or last column
      else if (
          (i != 0 && j == 0)
        || (i != no_rows-1 && j == no_columns-1)
        )
          {
            // check only horizontally, if
            // there are 3 adjacent match blocks
            if (v_3match(i,j)==true){
              console.log("There is a match at row " + String(i-1) + " to " + String(i+1) + " and  at column "+ String(j) +" to "+ String(j))
            }
          }
      //else check both horizontally and vertically
      else if (
          (i != 0 && j != 0)
        || (i != no_rows-1 && j != no_columns-1)
        )
          {
            if (h_3match(i,j)==true){
              console.log("There is a match at row " + String(i) + " to " + String(i) + " and  at column "+ String(j-1) +" to "+ String(j+1));
            }
            else if (v_3match(i,j)==true){
              console.log("There is a match at row " + String(i-1) + " to " + String(i+1) + " and  at column "+ String(j) +" to "+ String(j))
            }
          }
        
    }
  }
}

function h_3match(column,row){
  //this function check, if a block in a 
  //given column(i) and row (j)
  //has the same colour the left and 
  //right adjacent block
  let h_left = row - 1;
  let h_right = row + 1;
  if (blocks[row][column]["color"] == blocks[h_left][column]["color"]
    &&
    blocks[row][column]["color"] == blocks[h_right][column]["color"]
  ) {
              //draw rectangle around match
              context.beginPath();
              context.lineWidth = "4";
              context.strokeStyle = "green";
              context.rect((row-1)*sprite_width,(column*sprite_height)+2,3*sprite_width,sprite_height+4)
              context.stroke();
    return true;
  }
  else { return false;}
}

function v_3match(column,row){
  //this function check, if a block in a 
  //given column(i) and row (j)
  //has the same colour above and 
  //under the adjacent block
  let v_up = column - 1;
  let v_down = column + 1;
  if (blocks[row][column]["color"] == blocks[row][v_up]["color"]
    &&
    blocks[row][column]["color"] == blocks[row][v_down]["color"]
  ) {
              //draw rectangle around match
              context.beginPath();
              context.lineWidth = "4";
              context.strokeStyle = "green";
              context.rect(row*sprite_width,((column-1)*sprite_height),sprite_width,sprite_height*3)
              context.stroke();
    return true;
  }
  else { return false;}
}
function test(){
  console.log("test");
  //print test message in hmtl body
  document.getElementById("demo").innerHTML = "hello world again";
  console.log(h_3match(0,1));
  console.log(v_3match(1,0));
  check_matches();
  //create an array of block objects
  //let img = new Image();
  //img.src = "potions.png";
  /*context.drawImage(img,1*frame_width,3*frame_height,frame_width,frame_height,0,0,frame_width,frame_height)*/
  /*
  blocks.push(new block(false,0,0,"red"));
  blocks[0].draw_sprite();
  blocks.push(new block(false,0,1));
  blocks[1].draw_sprite();
  */
};

class block {
  constructor(is_selected=false,x_pos,y_pos,color="blue"){
    this.is_selected = is_selected;
    this.x_pos = x_pos*32;
    this.y_pos = y_pos*33;
    this.color = color;
    //this.sprite = sprite;
  }
  draw_sprite() {
    //draw a sprite based on the color and the position
    for (let i=0;i<sprite_types.length;i++){
      if (sprite_types[i]["color"] == this.color) 
        {
          context.drawImage(img,sprite_types[i]["sprite_column"]*frame_width,sprite_types[i]["sprite_row"]*frame_height,frame_width,frame_height,this.x_pos,this.y_pos,sprite_width,sprite_height);
        }
    }
  }
  print_status() {
    return (`Im block, selected: ${this.is_selected}, x_pos:${this.x_pos}, y_pos:${this.y_pos}, color:${this.color}`)
  }
}