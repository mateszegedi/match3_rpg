//create variables for latter use 
  let canvas;
  let context;
  let img;
  let frame_width = 16;
  let frame_height = 16;
  let sprite_width = 32;
  let sprite_height = 33;
  let match_length = 1;
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
  //game states:
  // init = game is starting up, no human action
  // player = player can take actions
  // ai = the AI takes actions, no  human action possible
  let game_states = { init: 0,
                  player: 1,
                  ai: 2
                } 
  let current_gamestate = game_states.init
  let blocks = [];
  let matched_blocks = [];
  let seconds_passed;
  let old_timestamp;
  let fps;
  //animation variables
  let animation_time = 0;
  // if the animation time is higher than
  // this static value, do something
  // we can do this so visible animations
  // will appear on the screen
  let animation_limit = 1000
  let animation_states = {
    ready: 0,
    finding_matches: 1,
    clearing_matches: 2
  }
  let current_animation_state = animation_states.finding_matches;
  let score = 0;
  
  
  
window.onload = init;
function init(){
  // Get a reference to the canvas
  canvas = document.getElementById('game_area');
  context = canvas.getContext('2d');
  img = new Image();
  img.src = "potions.png";
  //start game loop - e.g  the core of the game
  //start_game();
  window.requestAnimationFrame(game_loop);
  //draw();
}

//this is the main function, which checks,
// constantly all actions, draws the animations
// .etc
function game_loop(timeStamp){
  // Calculate the number of seconds passed since the last frame
    seconds_passed = (timeStamp - old_timestamp) / 1000;
    old_timestamp = timeStamp;

    // Calculate fps
    fps = Math.round(1 / seconds_passed);
    document.getElementById("fps").innerHTML = "FPS: " + String(fps);
    if (current_gamestate == game_states.player){
  //update(seconds_passed);
    draw();
    }

    // The loop function has reached it's end. Keep requesting new frames

  window.requestAnimationFrame(game_loop);
}

function start_game(){
  score = 0;
  document.getElementById("score").innerHTML = "Score: "+ score;
  //context.clearRect(0,0,canvas.width,canvas.height);
  //context.beginPath();
  generate_map();
  current_gamestate = game_states.player;
}

function generate_map(){
  blocks = [];
  //make a map dynamically
  for (let i=0;i<no_columns;i++) {
    // create a column
    blocks.push([]);
    for (let j=0;j<no_columns;j++) {
      //create new block at the given position
      make_new_block(i,j);
    }
  }
}

function make_new_block(column,row){
  //this function makes a new block at
  // a given position and draws it
  //pick a colour randomly
    random_color = Math.floor(Math.random() * valid_colors.length);
    //create a new sprite with this color
    blocks[column].push(new block(false,column,row,valid_colors[random_color]));
    //blocks[column][row].draw_sprite();
}

function replace_placeholder_block(column,row){
  //this function gives a random color for an
  //"empty" block and draws it
  //pick a colour randomly
    random_color = Math.floor(Math.random() * valid_colors.length);
    //create a new sprite with this color
    blocks[column][row]["color"] = valid_colors[random_color];
    //blocks[column][row].draw_sprite();
    //console.log(blocks[row][column]);
}

function update(seconds_passed){
  /* this function is responsible to
  check the board, find matches and 
  resolve them
  */
  //let's start by adding up animation time
  animation_time = animation_time + 1
  check_matches();
  current_animation_state = animation_states.finding_matches
  //as soon as it reached the hard-coded limit,
  //then continue
  if (animation_time > animation_limit){
    //check matches first
    clear_match();
    current_animation_state = animation_states.ready
  animation_time = 0;
  }
}

function check_matches(){
  /*this check loops through the blocks
  and checks if a match of three from the
  same colour are horizontally or vertically
  adjacent. If yes, print it to console log.
  */
  //let's empty the array of matches
  matched_blocks = [];
  temp_h_matches = [];
  temp_v_matches = [];
  //then, we find matches horizontally
  //so we loop column-by-column first
  // to check for every row, if there is
  //a horizontal match
  for (let i=0;i<no_rows;i++) {
    for (let j=0;j<no_columns;j++) {
      h_match(j,i,false);
    }
  }
  //then we loop row-by-row to find the vertical matches
  for (let i=0;i<no_columns;i++) {
    for (let j=0;j<no_rows;j++) {
      //h_match(i,j,false);
      v_match(i,j,false);
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
      //if cordinates are corner blocks
      if (
          (i == 0 && j == 0)
        || (i == 0 && j == no_rows-1)
        || (i == no_columns-1 && j == 0)
        || (i == no_columns-1 && j == no_rows-1)
        )
          {
            //currently we do not do anything
            continue;
          }
        //if coordinates are first or last row
      else if (
          (i == 0 && j != 0)
        || (i == no_columns-1 && j != no_rows-1)
        )
          {
            // check only vertically, if
            // there are 3 adjacent match blocks
            if (v_match(i,j,false)==true){
              
              //console.log("There is a match at row " + String(i) + " to " + String(i) + " and  at column "+ String(j-1) +" to "+ String(j+1))
            }
          }
      //if coordinates are first or last column
      else if (
          (i != 0 && j == 0)
        || (i != no_columns-1 && j == no_rows-1)
        )
          {
            // check only horizontally, if
            // there are 3 adjacent match blocks
            if (h_match(i,j,false)==true){
              //console.log("There is a match at row " + String(i-1) + " to " + String(i+1) + " and  at column "+ String(j) +" to "+ String(j))
            }
          }
      //else check both horizontally and vertically
      else if (
          (i != 0 && j != 0)
        || (i != no_columns-1 && j != no_rows-1)
        )
          {
            if (h_match(i,j,false)==true){
              //console.log("There is a match at row " + String(i) + " to " + String(i) + " and  at column "+ String(j-1) +" to "+ String(j+1));
            }
            else if (v_match(i,j,false)==true){
             // console.log("There is a match at row " + String(i-1) + " to " + String(i+1) + " and  at column "+ String(j) +" to "+ String(j))
            }
          }
        */
    }
  }
}

function h_match(column,row,check_only=false){
  //this function check, if a block in a 
  //given column and row 
  //has the same colour the left and 
  //adjacent block.
  // If yes and this is not a check only,
  // we add them to a temp array.
  
  //first, we check if this is the first column
  //todo: az input loop a baj, előbb soronként halad fentről lefelé aztán balról jobbra
  // ez a logika a vertical matchoz jó!
  if (column == 0){
    // Then we only add the current block to
    // the temp array
    temp_h_matches = [{column:column
      ,row:row
      ,color:blocks[column][row]["color"]
      ,match_type: "horisontal"
     }]
console.log("temp_h_matches added on column0")
console.log(temp_h_matches)
   }
   else {
     //check if the left column has the same color as the current block
      if (blocks[column][row]["color"] == blocks[column-1][row]["color"]) {
        //if yes, add this value to the temp array
        temp_h_matches.push({column:column
          ,row:row
          ,color:blocks[column][row]["color"]
          ,match_type: "horisontal"
        });
        console.log("temp_h_matches same color as left")
        console.log(temp_h_matches);
        //if this is the last column
        // and temp matches have already 3 items
        // push it also to the main matches array
        if (column == no_columns-1
          && temp_h_matches.length >= 3){
          matched_blocks.push(temp_h_matches);
          }
        }
      else {
        //check first, if the previous matches
        //array has at least 3 items
        if (temp_h_matches.length >= 3){
        // if yes, push them to the matches array
        matched_blocks.push(temp_h_matches);
        // and only then reset the temp matches
        // array  with this block
        }
        temp_h_matches = [{column:column
          ,row:row
          ,color:blocks[column][row]["color"]
          ,match_type: "horisontal"
        }];
          
        }
      }
   }

function v_match(column,row,check_only=false){
//this function check, if a block in a 
  //given column and row 
  //has the same colour the left and 
  //adjacent block.
  // If yes and this is not a check only,
  // we add them to a temp array.
  
  //first, we check if this is the first roe
  if (row == 0){
    // Then we only add the current block to
    // the temp array
    temp_v_matches = [{column:column
      ,row:row
      ,color:blocks[column][row]["color"]
      ,match_type: "vertical"
     }]
   }
   else {
     //check if the left column has the same color as the current block
      if (blocks[column][row]["color"] == blocks[column][row-1]["color"]) {
        //if yes, add this value to the temp array
        temp_v_matches.push({column:column
          ,row:row
          ,color:blocks[column][row]["color"]
          ,match_type: "vertical"
        });
        //if this is the last column
        // and temp matches have already 3 items
        // push it also to the main matches array
        if (row == no_rows-1
          && temp_v_matches.length >= 3){
          matched_blocks.push(temp_v_matches);
        }
      }
      else {
        //check first, if the previous matches
        //array has at least 3 items
        if (temp_v_matches.length >= 3){
        // if yes, push them to the matches array
        matched_blocks.push(temp_v_matches);
        // and only then reset the temp matches
        // array  with this block
        }
        temp_v_matches = [{column:column
          ,row:row
          ,color:blocks[column][row]["color"]
          ,match_type: "vertical"
        }];
          
        }
      }
}
  /*
  //this function check, if a block in a 
  //given column(i) and row (j)
  //has the same colour above and 
  //under the adjacent block
  let v_up = row - 1;
  let v_down = row + 1;
  if (blocks[column][row]["color"] == blocks[column][v_up]["color"]
    &&
    blocks[column][row]["color"] == blocks[column][v_down]["color"]
  ) {
    
    if (check_only==false){
              //draw rectangle around match
              context.beginPath();
              context.lineWidth = "4";
              context.strokeStyle = "green";
              context.rect(column*sprite_width,((row-1)*sprite_height),sprite_width,(sprite_height)*3)
              context.stroke();
              //todo: drawing should go to the draw() function
              console.log("drawing should be done");
              //add the matches blocks to an array
              //so later we can change the sprites/blocks to placeholders
              matched_blocks.push(
                {column:column, row:row-1},
                {column:column, row:row},
                {column:column, row:row+1}
                );
    }
    */


//this function takes the matched blocks
//set their block value as placeholder
//clear the image on the coordinate
//store the value in a temp array7
function clear_match(){
  
  // first, we set the blocks of all matched ones to placeholders
  for (let k=0;k<matched_blocks.length;k++) {
    for (let l=0;l<matched_blocks[k].length;l++){ 
    let temp_column = matched_blocks[k][l]["column"];
    let temp_row = matched_blocks[k][l]["row"];
    blocks[temp_column][temp_row]["color"] = "placeholder";
    //increase score for every match 
    score = score + 1
    //console.log(blocks[temp_row][temp
    //clear the sprite at that position
    /*
    context.clearRect((temp_column*sprite_width)-2,(temp_row*sprite_height)-2,sprite_width+4,sprite_height+4);
      */
      }

    };
  //we start with a loop through all rows
  // and columns, but we start from the
  // bottom row and work our way back to the top
  // and we shift down the values from the row above - if it is not a placeholder
  for (let i=0;i<no_columns;i++) {
    for (let j=no_rows-1;j>=0;j--) {
    //if this happens in the first row
    //create a new block at that position
      if (j==0 && blocks[i][j]["color"] == "placeholder"){
        replace_placeholder_block(i,j);
        }
        /*if this not a first row and the block is a placeholder and the one above is not a placeholder, shift it down with one row and make that a placeholder
        */
      else if (j!=0  && blocks[i][j]["color"] == "placeholder"){
        //find the first non-placeholder block above
        for (let k=j-1; k>=0; k--){
          if (blocks[i][k]["color"] != "placeholder"){
            //copy the color from the block above
            blocks[i][j]["color"] = blocks[i][k]["color"];
            console.log("shift happened from column " + String(i) + " row " + String(k) + " to column " + String(i) + " row " + String(j))
            //then make the block above as placeholder
            //so visually it looks like as
            //if the above block would fall down
            //by one block
            blocks[i][k]["color"] = "placeholder";
            //blocks[i][k].draw_sprite();
          } 
          else {
            //make a block in the position
            replace_placeholder_block(i,j);
          }
        }
        //clear sprite at position
        /*context.clearRect((i*sprite_width)-2,(j*sprite_height)-2,sprite_width+4,sprite_height+4);
        */
        //draw sprite
        //blocks[i][j].draw_sprite();
        }
        /*todo: if this not a first row and the block is a placeholder and the one above is a placeholder, find the first non-placeholder above and copy that here. If there are only placeholder blocks, create a new block on the position
        */
      }
    }
    document.getElementById("score").innerHTML = "Score: "+ score;
  }
  
function find_possible_moves(){
  /*this function loops through all fields, 
  check, if by swapping two adjacent tiles
  a match would appear or not
  */
}

function draw(){
  //this function cleans and draws the canvas
  //at every frame
  // first, we clean the drawing board
  context.clearRect(0,0,canvas.width,canvas.height);
  context.beginPath();
  //then re-draw the blocks
  for (let i=0;i<no_columns;i++) {
    for (let j=0;j<no_rows;j++) {
      blocks[i][j].draw_sprite();
        
      }
    }
      // if the matches should be displayed,
      //this animation will draw a green rectangle around them
      
      if (current_animation_state == animation_states.finding_matches){
        for (let k=0;k<matched_blocks.length;k++){
              //draw rectangle around horisontal matches
              //todo: it should draw only the first horisontal
              //for (let l=0;l<matched_blocks[k].length;l++){
              //console.log(matched_blocks[k])
              if (matched_blocks[k][0]["match_type"]=="horisontal"){
              context.beginPath();
              context.lineWidth = "4";
              context.strokeStyle = "green";
              context.rect(matched_blocks[k][0]["column"]*sprite_width,matched_blocks[k][0]["row"]*sprite_height,sprite_width*matched_blocks[k].length
                ,sprite_height)
              context.stroke();
              }
              else if  (matched_blocks[k][0]["match_type"]=="vertical"){
              context.beginPath();
              context.lineWidth = "4";
              context.strokeStyle = "green";
              context.rect(matched_blocks[k][0]["column"]*sprite_width,matched_blocks[k][0]["row"]*sprite_height,sprite_width
                ,sprite_height*matched_blocks[k].length)
              context.stroke();
              }
      }
    }
}

function test(){
  console.log("test");
  //print test message in hmtl body
  document.getElementById("demo").innerHTML = "hello world again";
  //console.log(h_3match(0,1));
  //console.log(v_3match(1,0));
  check_matches();
};

class block {
  constructor(is_selected=false,column,row,color="blue"){
    this.is_selected = is_selected;
    this.column = column*32;
    this.row = row*33;
    this.color = color;
    //this.sprite = sprite;
  }
  draw_sprite() {
    //draw a sprite based on the color and the position
    for (let i=0;i<sprite_types.length;i++){
      if (sprite_types[i]["color"] == this.color) 
        {
          context.drawImage(img,sprite_types[i]["sprite_column"]*frame_width,sprite_types[i]["sprite_row"]*frame_height,frame_width,frame_height,this.column,this.row,sprite_width,sprite_height);
        }
    }
  }
  print_status() {
    return (`Im block, selected: ${this.is_selected}, column:${this.column}, row:${this.row}, color:${this.color}`)
  }
}