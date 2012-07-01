package /*net.tongits.tint*/
{
import flash.display.BitmapData;
import flash.display.Shape;
import flash.display.Sprite;
import flash.events.TimerEvent;
import flash.events.KeyboardEvent;
import flash.geom.Point;
import flash.text.TextField;
import flash.text.TextFormat;
import flash.ui.Keyboard;
import flash.utils.ByteArray;
import flash.utils.Timer;

public class Main extends Sprite
{
    private static const COLORS:Array = [0xffffffff, 0xffffc20e, 0xff709ad1, 0xffe5aa7a, 0xfffff200, 0xffff7e00, 0xff546d8e, 0xff9c5a3c, 0xffffffff, 0xff22b14c];
    
    private var _currentBrick:Brick;
    private var _nextBrick:Brick;

    private var _gameMask:Array = [[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9], [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]];
    private var _gameMaskClone:ByteArray = new ByteArray();
    
    private var _scaleBy:Number = 20.0;
    private var _gameBoardBitmap:BitmapData;
    private var _chessBitmap:BitmapData;
    private var _gameboard:Shape;
    
    private var _nextBrickBitmap:BitmapData;
    private var _nextBrickDisplay:Shape;
    
    private var _dropTimer:Timer;
    
    private var _gameOver:Boolean;
    private var _gamePaused:Boolean;
    private var _gameOverScreen:Sprite;
    
    private var _defaultSpeed:Number = 1200;
    private var _level:Number;
    private var _pointToBeat:Number;
    private var _percentToBeat:Number = 1.15;
    private var _levelText:TextField;
    
    private var _score:Number;
    private var _scoreText:TextField;
    
    public function Main():void {
        init();
        startGame();
    }
    
    private function init():void {
        // create a separate sprite for the main game screen and next brick preview
        var mainGameScreen:Sprite = addChild(new Sprite) as Sprite;
        mainGameScreen.x = 10;
        mainGameScreen.y = 10;
        mainGameScreen.scaleX = _scaleBy;
        mainGameScreen.scaleY = _scaleBy;
        
        _chessBitmap = new BitmapData(2, 2, true);
        _chessBitmap.setPixel32(0, 0, 0x07000000);
        _chessBitmap.setPixel32(1, 1, 0x07000000);
        
        // backup the original game mask without the dropping brick
        _gameMaskClone.writeObject(_gameMask);
        _gameBoardBitmap = new BitmapData(_gameMask[0].length, _gameMask.length);
        
        _gameboard = mainGameScreen.addChild(new Shape) as Shape;
        
        // set to largest brick's size
        _nextBrickBitmap = new BitmapData(4, 4, false);
        _nextBrickDisplay = mainGameScreen.addChild(new Shape) as Shape;
        _nextBrickDisplay.x = _gameboard.x + _gameMask[0].length + 1;
        _nextBrickDisplay.y = _gameboard.y + 1;
        
        // add the text elements below the main game screen
        var textFormat:TextFormat = new TextFormat("Arial", 10);
        
        // no game is complete without scoring
        _score = 0;
        _scoreText = addChild(new TextField) as TextField;
        _scoreText.width = stage.stageWidth;
        _scoreText.defaultTextFormat = textFormat;
        _scoreText.htmlText = "<b>Score:</b> " + _score.toString();
        _scoreText.x = 10;
        _scoreText.y = stage.stageHeight - 50;
        
        // and levels
        _level = 1;
        _pointToBeat = 3000;
        _levelText = addChild(new TextField) as TextField;
        _levelText.width = stage.stageWidth;
        _levelText.defaultTextFormat = textFormat;
        _levelText.x = 10;
        _levelText.y = stage.stageHeight - 35;
        
        // add instructions
        var instText:TextField = addChild(new TextField) as TextField;
        instText.defaultTextFormat = textFormat;
        instText.x = stage.stageWidth - 95;
        instText.y = 130;
        instText.multiline = true;
        instText.htmlText = "<b>Controls:</b>\n"
                            + "up arrow = rotate\n"
                            + "spacebar = drop\n"
                            + "p = pause|resume\n"
                            + "n = start new game";
        
        stage.addEventListener(KeyboardEvent.KEY_DOWN, keyDownFunction);
        function keyDownFunction(event:KeyboardEvent):void {
            if (!_gameOver && (String.fromCharCode(event.charCode).toLowerCase() == "p")) {
                pauseGame();
            } else if (String.fromCharCode(event.charCode).toLowerCase() == "n") {
                startGame();
            } else  if (!_gameOver && !_gamePaused) {
                switch (event.keyCode) {
                    case Keyboard.LEFT: moveBrick(Brick.LEFT); break;
                    case Keyboard.UP: rotateBrick(); break;
                    case Keyboard.RIGHT: moveBrick(Brick.RIGHT); break;
                    case Keyboard.DOWN:
                        // score extra points when moving bricks down
                        updateScore();
                        moveBrick(Brick.DOWN);
                    break;
                }
            }
        }
        
        stage.addEventListener(KeyboardEvent.KEY_UP, keyUpFunction);
        function keyUpFunction(event:KeyboardEvent):void {
            if (!_gameOver && !_gamePaused) {
                switch (event.keyCode) {
                    case Keyboard.SPACE: dropBrick(); break;
                    default: break;
                }
            }
        }
    }
    
    private function updateScore(value:Number = 1):void {
        // update the score current level serves as multiplier
        _score += value * (_level * 2);
        _scoreText.htmlText = "<b>Score:</b> " + _score.toString();
        
        // increase level
        if (_score > _pointToBeat) {
            _level++;
            
            // increasing the point to beat by a constant value is ugly so we use a percentage value
            _pointToBeat += Math.round(_percentToBeat * _pointToBeat);
            trace("point to beat: " + _pointToBeat.toString());
            
            // increase drop speed by 150ms per level
            _dropTimer.stop();
            trace(_dropTimer.delay);
            if ((_dropTimer.delay - 150) <= 0) {
                _dropTimer.delay = 100;
            } else {
                _dropTimer.delay -= 150;
            }
            trace(_dropTimer.delay);
            _dropTimer.start();
        }
        
        _levelText.htmlText = "<b>Level:</b> " + _level.toString()
                            + "\nNext level after " +  _pointToBeat.toString() + " points.";
    }
    
    private function pauseGame():void {
        if (_gamePaused) {
            _gamePaused = false;
            _dropTimer.start();
            removeChildAt(numChildren - 1);
            // the pauseText TextField might have stolen the focus so we set this to null
            stage.focus = null;
        } else {
            _gamePaused = true;
            _dropTimer.stop();
            
            // show fader
            var fader:Sprite = addChild(new Sprite) as Sprite;
            fader.graphics.beginFill(0x000000, 0.90);
            fader.graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
            fader.graphics.endFill();
            
            var pausedText:TextField = fader.addChild(new TextField) as TextField;
            pausedText.selectable = false;
            pausedText.text = "Game paused.\nPress p to resume.";
            pausedText.width = stage.stageWidth;
            var tf:TextFormat = new TextFormat("Arial", 14, 0xffffff);
            tf.align = "center";
            pausedText.selectable = false;
            pausedText.setTextFormat(tf);
            pausedText.x = 0;
            pausedText.y = (stage.stageHeight / 2) - (pausedText.height / 2);
            
        }
    }
    
    private function startGame():void {
        if (_gameOverScreen != null) {
            removeChildAt(numChildren - 1);
            _gameOverScreen = null;
        }
        _score = -2;
        _level = 1;
        _pointToBeat = 3000;
        updateScore();
        
        _gameOver = false;
        _gamePaused = false;
        
        // reset the _gameMask, don't include the walls
        for (var i:uint = 0; i < _gameMask.length - 1; i++) {
            for (var j:uint = 1; j < _gameMask[0].length - 1; j++) {
                _gameMask[i][j] = 0;
            }
        }
        // as well as the clone
        _gameMaskClone = new ByteArray();
        _gameMaskClone.writeObject(_gameMask);
        
        if (_dropTimer == null) {
            _dropTimer = new Timer(_defaultSpeed);
            _dropTimer.addEventListener(TimerEvent.TIMER, function():void {
                moveBrick(Brick.DOWN);
            });
        } else {
            _dropTimer.reset();
            _dropTimer.delay  = _defaultSpeed;
            _dropTimer.start();
        }
        
        // create the brick, there is no current brick since this is the start of the game
        _nextBrick = new Brick();
        addNextBrick();
    }
    
    private function refresh():void {
        updateGameMask();
        renderScreen();
    }
    
    /**
     * Reset the gameboard mask excluding the currently dropping brick
     */
    private function updateGameMask():void {
        // reset the _gameMask
        _gameMaskClone.position = 0;
        _gameMask = _gameMaskClone.readObject() as Array;

        // update the _gameMask with the brick's new position
        var row:uint, col:uint;
        for (row = 0; row < _currentBrick.mask.length; row++) {
            for (col = 0; col < _currentBrick.mask[row].length; col++) {
                if (_currentBrick.mask[row][col] > 0) {
                    _gameMask[_currentBrick.point.y + row][_currentBrick.point.x + col + 1] = _currentBrick.mask[row][col];
                }
            }
        }
    }
    
    /**
     * Fill the shape objects with the updated changes in the game
     */
    private function renderScreen():void {
        if (_gameMask.length == 0) {
            throw new Error("_gameMask is empty!");
        }
        
        // the game baord
        _gameBoardBitmap.fillRect(_gameBoardBitmap.rect, 0x00000000);
        for (var i:uint = 0; i < _gameMask[0].length; i++) {
            for (var j:uint = 0; j < _gameMask.length; j++) {
                if (_gameMask[j][i] > 0) {
                    _gameBoardBitmap.setPixel32(i, j, COLORS[_gameMask[j][i]]);
                }
            }
        }
        
        
        _gameboard.graphics.clear();
        
        _gameboard.graphics.beginBitmapFill(_chessBitmap, null, true);
        _gameboard.graphics.drawRect(1, 1, _gameBoardBitmap.width - 2, _gameBoardBitmap.height -2);
        _gameboard.graphics.endFill();
        
        _gameboard.graphics.beginBitmapFill(_gameBoardBitmap, null, false);
        _gameboard.graphics.drawRect(0, 0, _gameBoardBitmap.width, _gameBoardBitmap.height);
        _gameboard.graphics.endFill();
        
        // display the next brick
        if (_nextBrick == null) {
            throw new Error("next brick not created!");
        }
        
        _nextBrickBitmap.fillRect(_nextBrickBitmap.rect, 0xffffffff);
        for (i = 0; i < _nextBrick.mask[0].length; i++) {
            for (j = 0; j < _nextBrick.mask.length; j++) {
                if (_nextBrick.mask[j][i] > 0) {
                    _nextBrickBitmap.setPixel(i, j, COLORS[_nextBrick.mask[j][i]]);
                }
            }
        }
        
        _nextBrickDisplay.graphics.clear();
        _nextBrickDisplay.graphics.beginBitmapFill(_nextBrickBitmap, null, false);
        _nextBrickDisplay.graphics.drawRect(0, 0, _nextBrickBitmap.width, _nextBrickBitmap.height);
        _nextBrickDisplay.graphics.endFill();
    }
    
    /**
     * Add the next brick in line to the _gameboard _gameMask
     */
    private function addNextBrick():void {
        _dropTimer.stop();
        
        if (_nextBrick == null) {
            throw new Error("next brick not created!");
        }
        
        _currentBrick = _nextBrick;
        _nextBrick = new Brick();
        var brickX:int =  (_gameMask[0].length / 2) - (_currentBrick.mask[0].length / 2);
        _currentBrick.point = new Point(brickX, 0);
        
        // update the screen
        refresh();
        
        // check for game over
        if (checkCollision(Brick.NONE)) {
            _gameOver = true;
            
            // display game over screen
            if (_gameOverScreen == null) {
                _gameOverScreen = addChild(new Sprite) as Sprite;
                _gameOverScreen.graphics.beginFill(0x000000, 0.90);
                _gameOverScreen.graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
                _gameOverScreen.graphics.endFill();
                
                var gameOverText:TextField = _gameOverScreen.addChild(new TextField) as TextField;
                gameOverText.selectable = false;
                gameOverText.text = "Game over!\nPress n to start new game.";
                gameOverText.width = stage.stageWidth;
                var tf:TextFormat = new TextFormat("Arial", 14, 0xffffff);
                tf.align = "center";
                gameOverText.selectable = false;
                gameOverText.setTextFormat(tf);
                gameOverText.x = 0;
                gameOverText.y = (stage.stageHeight / 2) - (gameOverText.height / 2);
            }
        } else {
            _dropTimer.start();
        }
    }
    
    /**
     * Move the brick to the left, right or down
     * @param direction An unsigned integer value indicating where the brick should be moved
     * @return True if the the move command was successful, False if the brick encountered a collision
     */
    private function moveBrick(direction:uint):Boolean {
        if (checkCollision(direction) == false) {
            _currentBrick.move(direction);
            
            // score points when moving bricks down
            if (direction == Brick.DOWN) {
                updateScore();
            }
            // update the screen only when the brick is moved
            refresh();
            return true;
        } else {
            // check if the brick has landed
            if (direction == Brick.DOWN) {
                landBrick();
            }
            return false;
        }
    }
    
    /**
     * Skip the dropping animation and instantly land the brick
     */
    private function dropBrick():void {
        while (moveBrick(Brick.DOWN)) {
            // score even more extra points when dropping bricks
            updateScore(2);
        }
    }
    
    /**
     * Check for collisions and then call the brick's rotate method
     */
    private function rotateBrick():void {
        _currentBrick.rotate();
        
        // check for collision
        if (checkCollision(Brick.NONE)) {
            _currentBrick.rotate(Brick.CW);
        } else {
            refresh();
        }
        
    }
    
    /**
     * Compare the brick's and the gamboard's masks for collisions
     * @param direction Where the brick is headed, either left, right, down or no movement
     * @return True if the brick encountered a collision, false otherwise
     */
    private function checkCollision(direction:uint):Boolean {
        function collided(x:int, y:int):Boolean {
            _gameMaskClone.position = 0;
            var mask:Array = _gameMaskClone.readObject() as Array;
            for (var row:uint = 0; row < _currentBrick.mask.length; row++) {
                for (var col:uint = 0; col < _currentBrick.mask[row].length; col++) {
                    if ((_currentBrick.mask[row][col] > 0) && (mask[y + row][x + col + 1] > 0)) {
                        return true;
                    }
                }
            }
            
            return false;
        }
        
        switch (direction) {
            case Brick.LEFT: return collided(_currentBrick.point.x - 1, _currentBrick.point.y);
            case Brick.RIGHT: return collided(_currentBrick.point.x + 1, _currentBrick.point.y);
            case Brick.DOWN: return collided(_currentBrick.point.x, _currentBrick.point.y + 1);
            // no movement, when rotating
            default: return collided(_currentBrick.point.x, _currentBrick.point.y);
        }
        
        return false;
    }
    
    /**
     * Control the landing event of the brick. Attempt to clear lines
     * then add the next brick to the gameboard.
     * 
     */
    private function landBrick():void {
        // check if we have cleared a line, don't check the floor
        var linesToClear:Array = new Array;
        for (var row:uint = 0; row < _gameMask.length - 1; row++) {
            var isLine:Boolean = true;
            for (var col:uint = 0; col < _gameMask[0].length; col++) {
                if (_gameMask[row][col] == 0) {
                    isLine = false;
                }
            }
            
            if (isLine) {
                linesToClear.push(row);
            }
        }
        
        // clear the lines
        if (linesToClear.length > 0) {
            for each (var line:uint in linesToClear) {
                _gameMask.splice(line, 1);
                
                // add the removed wall on top
                //_gameMask.unshift([9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9]);
                _gameMask.splice(1, 0, [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9]);
            }
        }
        
        // update the score, the number of lines cleared is squared
        updateScore((linesToClear.length * linesToClear.length * linesToClear.length) * 10);
        
        // update the _gameMaskClone
        _gameMaskClone = new ByteArray();
        _gameMaskClone.writeObject(_gameMask);
        
        // send next brick
        addNextBrick();
    }
    
}
}

import flash.geom.Point;

class Brick {
    public static const LEFT:uint = 0;
    public static const RIGHT:uint = 1;
    public static const DOWN:uint = 2;
    public static const NONE:uint = 3;
    
    public static const CCW:String = "CounterClockWise";
    public static const CW:String = "ClockWise";
    
    private static const O_BRICK:Array = [[[1, 1], [1, 1]]];
    private static const T_BRICK:Array = [[[2, 2, 2], [0, 2, 0], [0, 0, 0]], [[2, 0], [2, 2], [2, 0]], [[0, 0, 0], [0, 2, 0], [2, 2, 2]], [[0, 0, 2], [0, 2, 2], [0, 0, 2]]];
    private static const I_BRICK:Array = [[[0, 3], [0, 3], [0, 3], [0, 3]], [[0, 0, 0, 0], [3, 3, 3, 3]]];
    private static const J_BRICK:Array = [[[0, 4, 4], [0, 4, 0], [0, 4, 0]], [[4, 0, 0], [4, 4, 4], [0, 0, 0]], [[0, 4, 0], [0, 4, 0], [4, 4, 0]], [[0, 0, 0], [4, 4, 4], [0, 0, 4]]];
    private static const L_BRICK:Array = [[[0, 5, 0], [0, 5, 0], [0, 5, 5]], [[0, 0, 5], [5, 5, 5], [0, 0, 0]], [[5, 5, 0], [0, 5, 0], [0, 5, 0]], [[0, 0, 0], [5, 5, 5], [5, 0, 0]]];
    private static const S_BRICK:Array = [[[0, 6, 0], [0, 6, 6], [0, 0, 6]], [[0, 0, 0], [0, 6, 6], [6, 6, 0]], [[0, 6, 0], [0, 6, 6], [0, 0, 6]], [[0, 0, 0], [0, 6, 6], [6, 6, 0]]];
    private static const Z_BRICK:Array = [[[0, 7, 0], [7, 7, 0], [7, 0, 0]], [[0, 0, 0], [7, 7, 0], [0, 7, 7]], [[0, 7, 0], [7, 7, 0], [7, 0, 0]], [[0, 0, 0], [7, 7, 0], [0, 7, 7]]];
    private static const BRICKS:Array = [O_BRICK, T_BRICK, J_BRICK, L_BRICK, S_BRICK, Z_BRICK, I_BRICK];
    
    private var _type:Array;
    private var _x:int;
    private var _y:int;
    private var _state:uint;
    private var _mask:Array;
    
    public function Brick():void {
        // choose a random brick
        var randBrick:Number = Math.random() * (BRICKS.length - 1);
        randBrick = Math.round(randBrick);
        _type = BRICKS[randBrick];
        
        // choose a random rotational state
        var randState:Number = Math.random() * (BRICKS[randBrick].length - 1);
        randState = Math.round(randState);
        _state = randState;
        
        // set the brick's _mask
        _mask = BRICKS[randBrick][randState];
        
        // position the brick
        _x = 0;
        _y = 0;
    }
    
    
    public function get point():Point {
        return new Point(_x, _y);
    }
    
    public function set point(value:Point):void {
        _x = value.x;
        _y = value.y;
    }
    
    public function get mask():Array {
        return _mask;
    }
    
    /**
     * Move the brick to the left, right or down
     * @param direction An unsigned integer value indicating where the brick should be moved
     */
    public function move(direction:uint):void {
        switch (direction) {
            case LEFT: _x--; break;
            case RIGHT: _x++; break;
            case DOWN: _y++; break;
            
            // invalid direction
            default:
                throw new Error("Invalid direction");
            break;
        }
    }
    
    /**
     * Rotate the brick
     * @param rotation The direction of the brick's rotation, either counter-clockwise or clockwise
     */
    public function rotate(rotation:String = CCW):void {
        if (rotation ==  CCW) {
            // check if the brick's state is the last state in the brick's mask array
            if (_type.length - 1 == _state) {
                _state = 0;
                _mask = _type[_state];
            } else {
                _mask = _type[++_state];
            }
        } else { // clockwise
            // check if the brick's state is the first state in the brick's mask array
            if (_state == 0) {
                _state = _type.length - 1;
                _mask = _type[_state];
            } else {
                _mask = _type[--_state];
            }
        }

    }
}