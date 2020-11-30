/**
 * Datatypes copied from the 24a2 engine for use during tests, because
 * the engine code exposes them as globals and while that works in the browser,
 * I couldn't figure out a way to make the available when running tests.
 */
var Color;
(function (Color) {
    Color["Gray"] = "GRAY";
    Color["Black"] = "BLACK";
    Color["Red"] = "RED";
    Color["Orange"] = "ORANGE";
    Color["Yellow"] = "YELLOW";
    Color["Green"] = "GREEN";
    Color["Blue"] = "BLUE";
    Color["Indigo"] = "INDIGO";
    Color["Violet"] = "VIOLET";
})(Color || (Color = {}));
var Direction;
(function (Direction) {
    Direction["Left"] = "LEFT";
    Direction["Right"] = "RIGHT";
    Direction["Up"] = "UP";
    Direction["Down"] = "DOWN";
})(Direction || (Direction = {}));

export {Color, Direction}