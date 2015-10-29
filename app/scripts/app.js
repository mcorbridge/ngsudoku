/**
 *
 * ngSudoku
 * author: michael d corbridge
 *           boston - cape cod - toronto
 * first draft of HARD solution: Friday October 16, 2015
 * second draft: fix multi-occurrence indicator in individual row, column, square : Saturday October 17, 2015
 * third draft: provide an exit route for puzzles that cannot be solved by this algorithm  : Sunday October 18, 2015
 * fourth draft: update the html view to 'make it pretty'    : Tuesday October 20, 2015
 *
 * I started this challenge about a year ago when I was learning angularjs.  My goal was to solve a moderate puzzle
 * and to learn more about the inner workings of angularjs.  My first attempt was ... meh ... so,so.  I could solve an
 * easy puzzle, but things fell apart when my algorithm was confronted with a moderate puzzle.  I left it alone, then picked
 * it up this fall.  I started from scratch rather than refactoring my old code, of which there was a shitload of!  Within
 * about 2 days I had a solution for a moderate puzzle, and was bearing down on the hard.  My main mistake during my first
 * attempt was that I didn't build a good MVC representation of the problem.  This one does.  In all likelihood I could add
 * further methods that would allow me to solve expert puzzles.  But it's all been done before.  I'm really more interested
 * in moving on to other challenges.
 */
'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [])


	.controller('testCtrl', ['$scope', '$timeout','$rootScope', function ($scope,$timeout,$rootScope) {

		console.log('---> testCtrl');

		$scope.isDisabled = false;

		$scope.showCheckModal = false;
		$scope.showErrorModal = false;

		var isStarted = false;
		var solutionIterations = 0;
		var sudoku;
		var initialSudoku;
		var seedSudoku;
		var clonedSudokuSolution = [];
		var startTime;
		var endTime;
		var optionTest;
		var iterations = {easy: 0, simple: 0, options: 0};
		var matrix;
		var options;

		var c0, c1, c2, c3, c4, c5, c6, c7, c8,
			c9, c10, c11, c12, c13, c14, c15, c16, c17,
			c18, c19, c20, c21, c22, c23, c24, c25, c26,
			c27, c28, c29, c30, c31, c32, c33, c34, c35,
			c36, c37, c38, c39, c40, c41, c42, c43, c44,
			c45, c46, c47, c48, c49, c50, c51, c52, c53,
			c54, c55, c56, c57, c58, c59, c60, c61, c62,
			c63, c64, c65, c66, c67, c68, c69, c70, c71,
			c72, c73, c74, c75, c76, c77, c78, c79, c80;

		var col0, col1, col2, col3, col4, col5, col6, col7, col8;
		var columns;

		var row0, row1, row2, row3, row4, row5, row6, row7, row8;
		var rows;

		var sqr0, sqr1, sqr2, sqr3, sqr4, sqr5, sqr6, sqr7, sqr8;
		var squares;

		var o0, o1, o2, o3, o4, o5, o6, o7, o8,
			o9, o10, o11, o12, o13, o14, o15, o16, o17,
			o18, o19, o20, o21, o22, o23, o24, o25, o26,
			o27, o28, o29, o30, o31, o32, o33, o34, o35,
			o36, o37, o38, o39, o40, o41, o42, o43, o44,
			o45, o46, o47, o48, o49, o50, o51, o52, o53,
			o54, o55, o56, o57, o58, o59, o60, o61, o62,
			o63, o64, o65, o66, o67, o68, o69, o70, o71,
			o72, o73, o74, o75, o76, o77, o78, o79, o80;

		var col0Index = [0, 9, 18, 27, 36, 45, 54, 63, 72], col1Index = [1, 10, 19, 28, 37, 46, 55, 64, 73], col2Index = [2, 11, 20, 29, 38, 47, 56, 65, 74],
			col3Index = [3, 12, 21, 30, 39, 48, 57, 66, 75], col4Index = [4, 13, 22, 31, 40, 49, 58, 67, 76], col5Index = [5, 14, 23, 32, 41, 50, 59, 68, 77],
			col6Index = [6, 15, 24, 33, 42, 51, 60, 69, 78], col7Index = [7, 16, 25, 34, 43, 52, 61, 70, 79], col8Index = [8, 17, 26, 35, 44, 53, 62, 71, 80];

		var row0Index = [0, 1, 2, 3, 4, 5, 6, 7, 8], row1Index = [9, 10, 11, 12, 13, 14, 15, 16, 17], row2Index = [18, 19, 20, 21, 22, 23, 24, 25, 26],
			row3Index = [27, 28, 29, 30, 31, 32, 33, 34, 35], row4Index = [36, 37, 38, 39, 40, 41, 42, 43, 4], row5Index = [45, 46, 47, 48, 49, 50, 51, 52, 53],
			row6Index = [54, 55, 56, 57, 58, 59, 60, 61, 62], row7Index = [63, 64, 65, 66, 67, 68, 69, 70, 71], row8Index = [72, 73, 74, 75, 76, 77, 78, 79, 80];

		var sqr0Index = [0, 1, 2, 9, 10, 11, 18, 19, 20], sqr1Index = [3, 4, 5, 12, 13, 14, 21, 22, 23], sqr2Index = [6, 7, 8, 15, 16, 17, 24, 25, 26],
			sqr3Index = [27, 28, 29, 36, 37, 38, 45, 46, 47], sqr4Index = [30, 31, 32, 39, 40, 41, 48, 49, 50], sqr5Index = [33, 34, 35, 42, 43, 44, 51, 52, 53],
			sqr6Index = [54, 55, 56, 63, 64, 65, 72, 73, 74], sqr7Index = [57, 58, 59, 66, 67, 68, 75, 76, 77], sqr8Index = [60, 61, 62, 69, 70, 71, 78, 79, 80];


		var doEasy = function () {
			setColumns();
			setRows();
			setSquares();
			setCells();
			setOptions();
			setMatrix();
			easyCalculation();
			setView();
		};


		var setSudoku = function () {
			// this is classified as a hard puzzle
			sudoku = [0, 0, 0, 6, 0, 0, 7, 0, 0,
				0, 0, 0, 0, 5, 0, 9, 4, 0,
				0, 2, 1, 0, 0, 0, 0, 0, 0,
				0, 0, 2, 0, 0, 0, 0, 0, 0,
				1, 0, 8, 0, 6, 7, 0, 0, 3,
				0, 0, 0, 3, 2, 0, 8, 5, 7,
				8, 0, 0, 0, 0, 0, 0, 1, 0,
				0, 0, 4, 0, 8, 0, 0, 0, 0,
				0, 0, 7, 0, 0, 0, 2, 0, 0];

			// copy of the original puzzle  - used for reset
			seedSudoku = sudoku.slice(0);
		};

		var setOptions = function () {
			o0 = [], o1 = [], o2 = [], o3 = [], o4 = [], o5 = [], o6 = [], o7 = [], o8 = [],
				o9 = [], o10 = [], o11 = [], o12 = [], o13 = [], o14 = [], o15 = [], o16 = [], o17 = [],
				o18 = [], o19 = [], o20 = [], o21 = [], o22 = [], o23 = [], o24 = [], o25 = [], o26 = [],
				o27 = [], o28 = [], o29 = [], o30 = [], o31 = [], o32 = [], o33 = [], o34 = [], o35 = [],
				o36 = [], o37 = [], o38 = [], o39 = [], o40 = [], o41 = [], o42 = [], o43 = [], o44 = [],
				o45 = [], o46 = [], o47 = [], o48 = [], o49 = [], o50 = [], o51 = [], o52 = [], o53 = [],
				o54 = [], o55 = [], o56 = [], o57 = [], o58 = [], o59 = [], o60 = [], o61 = [], o62 = [],
				o63 = [], o64 = [], o65 = [], o66 = [], o67 = [], o68 = [], o69 = [], o70 = [], o71 = [],
				o72 = [], o73 = [], o74 = [], o75 = [], o76 = [], o77 = [], o78 = [], o79 = [], o80 = [];
		};

		/**
		 * Each cell in a Sudoku puzzle is associated with a column, row and square.
		 * As part of this association, it must satisfy the condition where the value
		 * cannot appear anywhere else in it's associated column, row or square.
		 * In addition, where a unique cell value cannot be unambiguously determined,
		 * that cell has a array (options) of distinct possibilities.
		 * Welcome to the world of Sudoku!
		 */
		var setCells = function () {
			c0 = [sudoku[0], col0, row0, sqr0, o0];
			c1 = [sudoku[1], col1, row0, sqr0, o1];
			c2 = [sudoku[2], col2, row0, sqr0, o2];
			c3 = [sudoku[3], col3, row0, sqr1, o3];
			c4 = [sudoku[4], col4, row0, sqr1, o4];
			c5 = [sudoku[5], col5, row0, sqr1, o5];
			c6 = [sudoku[6], col6, row0, sqr2, o6];
			c7 = [sudoku[7], col7, row0, sqr2, o7];
			c8 = [sudoku[8], col8, row0, sqr2, o8];

			c9 = [sudoku[9], col0, row1, sqr0, o9];
			c10 = [sudoku[10], col1, row1, sqr0, o10];
			c11 = [sudoku[11], col2, row1, sqr0, o11];
			c12 = [sudoku[12], col3, row1, sqr1, o12];
			c13 = [sudoku[13], col4, row1, sqr1, o13];
			c14 = [sudoku[14], col5, row1, sqr1, o14];
			c15 = [sudoku[15], col6, row1, sqr2, o15];
			c16 = [sudoku[16], col7, row1, sqr2, o16];
			c17 = [sudoku[17], col8, row1, sqr2, o17];

			c18 = [sudoku[18], col0, row2, sqr0, o18];
			c19 = [sudoku[19], col1, row2, sqr0, o19];
			c20 = [sudoku[20], col2, row2, sqr0, o20];
			c21 = [sudoku[21], col3, row2, sqr1, o21];
			c22 = [sudoku[22], col4, row2, sqr1, o22];
			c23 = [sudoku[23], col5, row2, sqr1, o23];
			c24 = [sudoku[24], col6, row2, sqr2, o24];
			c25 = [sudoku[25], col7, row2, sqr2, o25];
			c26 = [sudoku[26], col8, row2, sqr2, o26];

			//--------------------------------------------

			c27 = [sudoku[27], col0, row3, sqr3, o27];
			c28 = [sudoku[28], col1, row3, sqr3, o28];
			c29 = [sudoku[29], col2, row3, sqr3, o29];
			c30 = [sudoku[30], col3, row3, sqr4, o30];
			c31 = [sudoku[31], col4, row3, sqr4, o31];
			c32 = [sudoku[32], col5, row3, sqr4, o32];
			c33 = [sudoku[33], col6, row3, sqr5, o33];
			c34 = [sudoku[34], col7, row3, sqr5, o34];
			c35 = [sudoku[35], col8, row3, sqr5, o35];

			c36 = [sudoku[36], col0, row4, sqr3, o36];
			c37 = [sudoku[37], col1, row4, sqr3, o37];
			c38 = [sudoku[38], col2, row4, sqr3, o38];
			c39 = [sudoku[39], col3, row4, sqr4, o39];
			c40 = [sudoku[40], col4, row4, sqr4, o40];
			c41 = [sudoku[41], col5, row4, sqr4, o41];
			c42 = [sudoku[42], col6, row4, sqr5, o42];
			c43 = [sudoku[43], col7, row4, sqr5, o43];
			c44 = [sudoku[44], col8, row4, sqr5, o44];

			c45 = [sudoku[45], col0, row5, sqr3, o44];
			c46 = [sudoku[46], col1, row5, sqr3, o46];
			c47 = [sudoku[47], col2, row5, sqr3, o47];
			c48 = [sudoku[48], col3, row5, sqr4, o48];
			c49 = [sudoku[49], col4, row5, sqr4, o49];
			c50 = [sudoku[50], col5, row5, sqr4, o50];
			c51 = [sudoku[51], col6, row5, sqr5, o51];
			c52 = [sudoku[52], col7, row5, sqr5, o52];
			c53 = [sudoku[53], col8, row5, sqr5, o53];

			//--------------------------------------------

			c54 = [sudoku[54], col0, row6, sqr6, o54];
			c55 = [sudoku[55], col1, row6, sqr6, o55];
			c56 = [sudoku[56], col2, row6, sqr6, o56];
			c57 = [sudoku[57], col3, row6, sqr7, o57];
			c58 = [sudoku[58], col4, row6, sqr7, o58];
			c59 = [sudoku[59], col5, row6, sqr7, o59];
			c60 = [sudoku[60], col6, row6, sqr8, o60];
			c61 = [sudoku[61], col7, row6, sqr8, o61];
			c62 = [sudoku[62], col8, row6, sqr8, o62];

			c63 = [sudoku[63], col0, row7, sqr6, o63];
			c64 = [sudoku[64], col1, row7, sqr6, o64];
			c65 = [sudoku[65], col2, row7, sqr6, o65];
			c66 = [sudoku[66], col3, row7, sqr7, o66];
			c67 = [sudoku[67], col4, row7, sqr7, o67];
			c68 = [sudoku[68], col5, row7, sqr7, o68];
			c69 = [sudoku[69], col6, row7, sqr8, o69];
			c70 = [sudoku[70], col7, row7, sqr8, o70];
			c71 = [sudoku[71], col8, row7, sqr8, o71];

			c72 = [sudoku[72], col0, row8, sqr6, o72];
			c73 = [sudoku[73], col1, row8, sqr6, o73];
			c74 = [sudoku[74], col2, row8, sqr6, o74];
			c75 = [sudoku[75], col3, row8, sqr7, o75];
			c76 = [sudoku[76], col4, row8, sqr7, o76];
			c77 = [sudoku[77], col5, row8, sqr7, o77];
			c78 = [sudoku[78], col6, row8, sqr8, o78];
			c79 = [sudoku[79], col7, row8, sqr8, o79];
			c80 = [sudoku[80], col8, row8, sqr8, o80];
		};

		var setColumns = function () {
			col0 = [sudoku[0], sudoku[9], sudoku[18], sudoku[27], sudoku[36], sudoku[45], sudoku[54], sudoku[63], sudoku[72]];
			col1 = [sudoku[1], sudoku[10], sudoku[19], sudoku[28], sudoku[37], sudoku[46], sudoku[55], sudoku[64], sudoku[73]];
			col2 = [sudoku[2], sudoku[11], sudoku[20], sudoku[29], sudoku[38], sudoku[47], sudoku[56], sudoku[65], sudoku[74]];
			col3 = [sudoku[3], sudoku[12], sudoku[21], sudoku[30], sudoku[39], sudoku[48], sudoku[57], sudoku[66], sudoku[75]];
			col4 = [sudoku[4], sudoku[13], sudoku[22], sudoku[31], sudoku[40], sudoku[49], sudoku[58], sudoku[67], sudoku[76]];
			col5 = [sudoku[5], sudoku[14], sudoku[23], sudoku[32], sudoku[41], sudoku[50], sudoku[59], sudoku[68], sudoku[77]];
			col6 = [sudoku[6], sudoku[15], sudoku[24], sudoku[33], sudoku[42], sudoku[51], sudoku[60], sudoku[69], sudoku[78]];
			col7 = [sudoku[7], sudoku[16], sudoku[25], sudoku[34], sudoku[43], sudoku[52], sudoku[61], sudoku[70], sudoku[79]];
			col8 = [sudoku[8], sudoku[17], sudoku[26], sudoku[35], sudoku[44], sudoku[53], sudoku[62], sudoku[71], sudoku[80]];
			columns = [col0, col1, col2, col3, col4, col5, col6, col7, col8];
		};

		var getGlobalColumnIndex = function (column, index) {
			var columnIndices = [col0Index, col1Index, col2Index, col3Index, col4Index, col5Index, col6Index, col7Index, col8Index];
			return columnIndices[column][index];
		};

		var setRows = function () {
			row0 = [sudoku[0], sudoku[1], sudoku[2], sudoku[3], sudoku[4], sudoku[5], sudoku[6], sudoku[7], sudoku[8]];
			row1 = [sudoku[9], sudoku[10], sudoku[11], sudoku[12], sudoku[13], sudoku[14], sudoku[15], sudoku[16], sudoku[17]];
			row2 = [sudoku[18], sudoku[19], sudoku[20], sudoku[21], sudoku[22], sudoku[23], sudoku[24], sudoku[25], sudoku[26]];
			row3 = [sudoku[27], sudoku[28], sudoku[29], sudoku[30], sudoku[31], sudoku[32], sudoku[33], sudoku[34], sudoku[35]];
			row4 = [sudoku[36], sudoku[37], sudoku[38], sudoku[39], sudoku[40], sudoku[41], sudoku[42], sudoku[43], sudoku[44]];
			row5 = [sudoku[45], sudoku[46], sudoku[47], sudoku[48], sudoku[49], sudoku[50], sudoku[51], sudoku[52], sudoku[53]];
			row6 = [sudoku[54], sudoku[55], sudoku[56], sudoku[57], sudoku[58], sudoku[59], sudoku[60], sudoku[61], sudoku[62]];
			row7 = [sudoku[63], sudoku[64], sudoku[65], sudoku[66], sudoku[67], sudoku[68], sudoku[69], sudoku[70], sudoku[71]];
			row8 = [sudoku[72], sudoku[73], sudoku[74], sudoku[75], sudoku[76], sudoku[77], sudoku[78], sudoku[79], sudoku[80]];
			rows = [row0, row1, row2, row3, row4, row5, row6, row7, row8];
		};

		var getGlobalRowIndex = function (row, index) {
			var rowIndices = [row0Index, row1Index, row2Index, row3Index, row4Index, row5Index, row6Index, row7Index, row8Index];
			return rowIndices[row][index];
		};

		var setSquares = function () {
			sqr0 = [sudoku[0], sudoku[1], sudoku[2], sudoku[9], sudoku[10], sudoku[11], sudoku[18], sudoku[19], sudoku[20]];
			sqr1 = [sudoku[3], sudoku[4], sudoku[5], sudoku[12], sudoku[13], sudoku[14], sudoku[21], sudoku[22], sudoku[23]];
			sqr2 = [sudoku[6], sudoku[7], sudoku[8], sudoku[15], sudoku[16], sudoku[17], sudoku[24], sudoku[25], sudoku[26]];
			sqr3 = [sudoku[27], sudoku[28], sudoku[29], sudoku[36], sudoku[37], sudoku[38], sudoku[45], sudoku[46], sudoku[47]];
			sqr4 = [sudoku[30], sudoku[31], sudoku[32], sudoku[39], sudoku[40], sudoku[41], sudoku[48], sudoku[49], sudoku[50]];
			sqr5 = [sudoku[33], sudoku[34], sudoku[35], sudoku[42], sudoku[43], sudoku[44], sudoku[51], sudoku[52], sudoku[53]];
			sqr6 = [sudoku[54], sudoku[55], sudoku[56], sudoku[63], sudoku[64], sudoku[65], sudoku[72], sudoku[73], sudoku[74]];
			sqr7 = [sudoku[57], sudoku[58], sudoku[59], sudoku[66], sudoku[67], sudoku[68], sudoku[75], sudoku[76], sudoku[77]];
			sqr8 = [sudoku[60], sudoku[61], sudoku[62], sudoku[69], sudoku[70], sudoku[71], sudoku[78], sudoku[79], sudoku[80]];
			squares = [sqr0, sqr1, sqr2, sqr3, sqr4, sqr5, sqr6, sqr7, sqr8];
		};

		var getGlobalSquareIndex = function (square, index, sqr) {
			var squareIndices = [sqr0Index, sqr1Index, sqr2Index, sqr3Index, sqr4Index, sqr5Index, sqr6Index, sqr7Index, sqr8Index];
			// this is a type of javascript method overloading
			// one of the benefits of javascript, I guess ;-)
			if (sqr !== null) {
				return squareIndices[sqr];
			} else {
				return squareIndices[square][index];
			}
		};

		var setMatrix = function () {
			matrix = [c0, c1, c2, c3, c4, c5, c6, c7, c8,
				c9, c10, c11, c12, c13, c14, c15, c16, c17,
				c18, c19, c20, c21, c22, c23, c24, c25, c26,
				c27, c28, c29, c30, c31, c32, c33, c34, c35,
				c36, c37, c38, c39, c40, c41, c42, c43, c44,
				c45, c46, c47, c48, c49, c50, c51, c52, c53,
				c54, c55, c56, c57, c58, c59, c60, c61, c62,
				c63, c64, c65, c66, c67, c68, c69, c70, c71,
				c72, c73, c74, c75, c76, c77, c78, c79, c80];
		};

		var setView = function () {
			$scope.value0 = (sudoku[0] === 0) ? null : sudoku[0];
			$scope.value1 = (sudoku[1] === 0) ? null : sudoku[1];
			$scope.value2 = (sudoku[2] === 0) ? null : sudoku[2];
			$scope.value3 = (sudoku[3] === 0) ? null : sudoku[3];
			$scope.value4 = (sudoku[4] === 0) ? null : sudoku[4];
			$scope.value5 = (sudoku[5] === 0) ? null : sudoku[5];
			$scope.value6 = (sudoku[6] === 0) ? null : sudoku[6];
			$scope.value7 = (sudoku[7] === 0) ? null : sudoku[7];
			$scope.value8 = (sudoku[8] === 0) ? null : sudoku[8];

			$scope.value9 = (sudoku[9] === 0) ? null : sudoku[9];
			$scope.value10 = (sudoku[10] === 0) ? null : sudoku[10];
			$scope.value11 = (sudoku[11] === 0) ? null : sudoku[11];
			$scope.value12 = (sudoku[12] === 0) ? null : sudoku[12];
			$scope.value13 = (sudoku[13] === 0) ? null : sudoku[13];
			$scope.value14 = (sudoku[14] === 0) ? null : sudoku[14];
			$scope.value15 = (sudoku[15] === 0) ? null : sudoku[15];
			$scope.value16 = (sudoku[16] === 0) ? null : sudoku[16];
			$scope.value17 = (sudoku[17] === 0) ? null : sudoku[17];

			$scope.value18 = (sudoku[18] === 0) ? null : sudoku[18];
			$scope.value19 = (sudoku[19] === 0) ? null : sudoku[19];
			$scope.value20 = (sudoku[20] === 0) ? null : sudoku[20];
			$scope.value21 = (sudoku[21] === 0) ? null : sudoku[21];
			$scope.value22 = (sudoku[22] === 0) ? null : sudoku[22];
			$scope.value23 = (sudoku[23] === 0) ? null : sudoku[23];
			$scope.value24 = (sudoku[24] === 0) ? null : sudoku[24];
			$scope.value25 = (sudoku[25] === 0) ? null : sudoku[25];
			$scope.value26 = (sudoku[26] === 0) ? null : sudoku[26];

			//----------------------------------------------------

			$scope.value27 = (sudoku[27] === 0) ? null : sudoku[27];
			$scope.value28 = (sudoku[28] === 0) ? null : sudoku[28];
			$scope.value29 = (sudoku[29] === 0) ? null : sudoku[29];
			$scope.value30 = (sudoku[30] === 0) ? null : sudoku[30];
			$scope.value31 = (sudoku[31] === 0) ? null : sudoku[31];
			$scope.value32 = (sudoku[32] === 0) ? null : sudoku[32];
			$scope.value33 = (sudoku[33] === 0) ? null : sudoku[33];
			$scope.value34 = (sudoku[34] === 0) ? null : sudoku[34];
			$scope.value35 = (sudoku[35] === 0) ? null : sudoku[35];

			$scope.value36 = (sudoku[36] === 0) ? null : sudoku[36];
			$scope.value37 = (sudoku[37] === 0) ? null : sudoku[37];
			$scope.value38 = (sudoku[38] === 0) ? null : sudoku[38];
			$scope.value39 = (sudoku[39] === 0) ? null : sudoku[39];
			$scope.value40 = (sudoku[40] === 0) ? null : sudoku[40];
			$scope.value41 = (sudoku[41] === 0) ? null : sudoku[41];
			$scope.value42 = (sudoku[42] === 0) ? null : sudoku[42];
			$scope.value43 = (sudoku[43] === 0) ? null : sudoku[43];
			$scope.value44 = (sudoku[44] === 0) ? null : sudoku[44];

			$scope.value45 = (sudoku[45] === 0) ? null : sudoku[45];
			$scope.value46 = (sudoku[46] === 0) ? null : sudoku[46];
			$scope.value47 = (sudoku[47] === 0) ? null : sudoku[47];
			$scope.value48 = (sudoku[48] === 0) ? null : sudoku[48];
			$scope.value49 = (sudoku[49] === 0) ? null : sudoku[49];
			$scope.value50 = (sudoku[50] === 0) ? null : sudoku[50];
			$scope.value51 = (sudoku[51] === 0) ? null : sudoku[51];
			$scope.value52 = (sudoku[52] === 0) ? null : sudoku[52];
			$scope.value53 = (sudoku[53] === 0) ? null : sudoku[53];

			//----------------------------------------------------

			$scope.value54 = (sudoku[54] === 0) ? null : sudoku[54];
			$scope.value55 = (sudoku[55] === 0) ? null : sudoku[55];
			$scope.value56 = (sudoku[56] === 0) ? null : sudoku[56];
			$scope.value57 = (sudoku[57] === 0) ? null : sudoku[57];
			$scope.value58 = (sudoku[58] === 0) ? null : sudoku[58];
			$scope.value59 = (sudoku[59] === 0) ? null : sudoku[59];
			$scope.value60 = (sudoku[60] === 0) ? null : sudoku[60];
			$scope.value61 = (sudoku[61] === 0) ? null : sudoku[61];
			$scope.value62 = (sudoku[62] === 0) ? null : sudoku[62];

			$scope.value63 = (sudoku[63] === 0) ? null : sudoku[63];
			$scope.value64 = (sudoku[64] === 0) ? null : sudoku[64];
			$scope.value65 = (sudoku[65] === 0) ? null : sudoku[65];
			$scope.value66 = (sudoku[66] === 0) ? null : sudoku[66];
			$scope.value67 = (sudoku[67] === 0) ? null : sudoku[67];
			$scope.value68 = (sudoku[68] === 0) ? null : sudoku[68];
			$scope.value69 = (sudoku[69] === 0) ? null : sudoku[69];
			$scope.value70 = (sudoku[70] === 0) ? null : sudoku[70];
			$scope.value71 = (sudoku[71] === 0) ? null : sudoku[71];

			$scope.value72 = (sudoku[72] === 0) ? null : sudoku[72];
			$scope.value73 = (sudoku[73] === 0) ? null : sudoku[73];
			$scope.value74 = (sudoku[74] === 0) ? null : sudoku[74];
			$scope.value75 = (sudoku[75] === 0) ? null : sudoku[75];
			$scope.value76 = (sudoku[76] === 0) ? null : sudoku[76];
			$scope.value77 = (sudoku[77] === 0) ? null : sudoku[77];
			$scope.value78 = (sudoku[78] === 0) ? null : sudoku[78];
			$scope.value79 = (sudoku[79] === 0) ? null : sudoku[79];
			$scope.value80 = (sudoku[80] === 0) ? null : sudoku[80];
		};

		var doAssociated = function (cellTestValue, associatedArray) {
			return associatedArray.indexOf(cellTestValue) !== -1;
		};

		/**
		 * This is the most straightforward of solution algorithms
		 * If a column, row or square is missing a single value
		 * Then it is obvious which number must be inserted.
		 * Humans solve this intuitively, but a computer needs to grind
		 * through the arrays to find the missing number.
		 */
		var easyCalculation = function () {
			var n;
			var p;
			var count;
			var column;
			var row;
			var square;
			var missingObject = {};
			var isCellSolved = false;

			for (n = 0; n < columns.length; n++) {
				column = columns[n];
				count = 0;
				for (p = 0; p < column.length; p++) {
					if (column[p] !== 0) {
						count++;
					}
				}
				if (count === 8) {
					missingObject = doSequenceOfEight(column);
					sudoku[getGlobalColumnIndex(n, missingObject['indexOfMissingNumber'])] = missingObject['missingNumber'];
					setNewCellValue();
					isCellSolved = true;
				}
			}

			for (n = 0; n < rows.length; n++) {
				row = rows[n];
				count = 0;
				for (p = 0; p < row.length; p++) {
					if (row[p] !== 0) {
						count++;
					}
				}
				if (count === 8) {
					missingObject = doSequenceOfEight(row);
					sudoku[getGlobalRowIndex(n, missingObject['indexOfMissingNumber'])] = missingObject['missingNumber'];
					setNewCellValue();
					isCellSolved = true;
				}
			}

			for (n = 0; n < squares.length; n++) {
				square = squares[n];
				count = 0;
				for (p = 0; p < square.length; p++) {
					if (square[p] !== 0) {
						count++;
					}
				}
				if (count === 8) {
					missingObject = doSequenceOfEight(square);
					sudoku[getGlobalSquareIndex(n, missingObject['indexOfMissingNumber'])] = missingObject['missingNumber'];
					setNewCellValue();
					isCellSolved = true;
				}
			}

			if (isCellSolved)
				iterations['easy']++;
		};

		var doSequenceOfEight = function (sequence) {
			var missingNumber;
			for (var n = 1; n < 10; n++) {
				if (sequence.indexOf(n) === -1) {
					missingNumber = n;
					break;
				}
			}
			var indexOfMissingNumber = sequence.indexOf(0);
			return {missingNumber: missingNumber, indexOfMissingNumber: indexOfMissingNumber};
		};

		/**
		 * @param cellData
		 * In retrospect, I'm not a big fan of how I named these methods.  After I wrote this code
		 * I stumbled upon a sudopedia.enjoysudoku.com that lists the *official* names of all
		 * the naming strategies.  The basic strategies include: naked pairs, naked triples, naked quads,
		 * hidden pairs, hidden triples, hidden quads, pointing pairs, box/line intersection ... and a whole
		 * lot more!  My only goal was to solve a *hard* puzzle that was generated on my phone app, or iPad.
		 * This does it.
		 */
		var doSimple = function (cellData) {
			var cellNumber = cellData['cellNumber'];
			var cellValue = cellData['cellValue'];
			var associatedColumn = cellData['associatedColumn'];
			var associatedRow = cellData['associatedRow'];
			var associatedSquare = cellData['associatedSquare'];

			var possibleCellSolution = [];

			for (var n = 1; n < 10; n++) {
				if (!doAssociated(n, associatedColumn) && !doAssociated(n, associatedRow) && !doAssociated(n, associatedSquare)) {
					possibleCellSolution.push(n);
				}
			}

			if (possibleCellSolution.length === 1) {
				sudoku[cellNumber] = possibleCellSolution[0];
				iterations['simple']++;
			}
		};

		var getNumberOpenCells = function () {
			var openCellNum = 0;
			var emptyCellNum = {value: 0};
			for (var n = 0; n < matrix.length; n++) {
				var cellData = {
					cellNumber: n,
					cellValue: matrix[n][0],
					associatedColumn: matrix[n][1],
					associatedRow: matrix[n][2],
					associatedSquare: matrix[n][3]
				};
				if (cellData['cellValue'] === 0) {
					openCellNum++;
				}
			}
			emptyCellNum['value'] = openCellNum;
			return emptyCellNum;
		};


		var matrixCalculation = function () {
			for (var n = 0; n < matrix.length; n++) {
				var cellData = {
					cellNumber: n,
					cellValue: matrix[n][0],
					associatedColumn: matrix[n][1],
					associatedRow: matrix[n][2],
					associatedSquare: matrix[n][3]
				};
				if (cellData['cellValue'] === 0) {
					doSimple(cellData);
				}
			}
		};

		var doComplex = function (cellData) {
			var cellNumber = cellData['cellNumber'];
			var cellValue = cellData['cellValue'];
			var associatedColumn = cellData['associatedColumn'];
			var associatedRow = cellData['associatedRow'];
			var associatedSquare = cellData['associatedSquare'];

			var possibleCellOptions = [];

			for (var n = 1; n < 10; n++) {
				if (!doAssociated(n, associatedColumn) && !doAssociated(n, associatedRow) && !doAssociated(n, associatedSquare)) {
					possibleCellOptions.push(n);
				}
			}
			matrix[cellNumber][4] = possibleCellOptions;
		};

		var doBruteForceComplex = function (cellData) {
			var cellNumber = cellData['cellNumber'];
			var cellValue = cellData['cellValue'];
			var associatedColumn = cellData['associatedColumn'];
			var associatedRow = cellData['associatedRow'];
			var associatedSquare = cellData['associatedSquare'];

			var possibleCellOptions = [];

			for (var n = 1; n < 10; n++) {
				if (!doAssociated(n, associatedColumn) && !doAssociated(n, associatedRow) && !doAssociated(n, associatedSquare)) {
					possibleCellOptions.push(n);
				}
			}
			clonedSudokuSolution[cellNumber][4] = possibleCellOptions;
		};

		Array.prototype.contains = function (v) {
			for (var i = 0; i < this.length; i++) {
				if (this[i] === v) return true;
			}
			return false;
		};


		Array.prototype.getSingleItemValue = function () {
			this.sort();
			var current = null;
			var cnt = 0;
			var uniqueNum = 0;
			for (var i = 0; i < this.length; i++) {
				if (this[i] != current) {
					if (cnt === 1) {
						uniqueNum = current;
					}
					current = this[i];
					cnt = 1;
				} else {
					cnt++;
				}
			}
			if (cnt === 1) {
				uniqueNum = current;
			}
			return uniqueNum;
		};

		var getCellCorrespondingToSingleValue = function (value, square) {
			var correspondingCell = 0;
			if (value !== 0) {
				for (var n = 0; n < square.length; n++) {
					if (square[n].values.indexOf(value) !== -1) {
						correspondingCell = square[n].cell;
						break;
					}
				}

			}
			return correspondingCell;
		};

		var doOptions = function () {
			var n;
			for (n = 0; n < matrix.length; n++) {
				var cellData = {
					cellNumber: n,
					cellValue: matrix[n][0],
					associatedColumn: matrix[n][1],
					associatedRow: matrix[n][2],
					associatedSquare: matrix[n][3]
				};
				if (cellData['cellValue'] === 0) {
					doComplex(cellData);
				}
			}

			var sqrOduplicates = [], sqr1duplicates = [], sqr2duplicates = [], sqr3duplicates = [], sqr4duplicates = [],
				sqr5duplicates = [], sqr6duplicates = [], sqr7duplicates = [], sqr8duplicates = [];

			var square0 = [], square1 = [], square2 = [], square3 = [], square4 = [], square5 = [], square6 = [], square7 = [], square8 = [];

			var cellNumber;
			var cellSolution;

			var duplicates = [sqrOduplicates, sqr1duplicates, sqr2duplicates, sqr3duplicates, sqr4duplicates, sqr5duplicates, sqr6duplicates, sqr7duplicates, sqr8duplicates];
			var squares = [square0, square1, square2, square3, square4, square5, square6, square7, square8];

			for (var m = 0; m < duplicates.length; m++) {
				var sqrMap = getGlobalSquareIndex(null, null, m);  // javascript overloading?
				var dupes = duplicates[m];
				var square = squares[m];
				for (n = 0; n < sqrMap.length; n++) {
					square.push({cell: sqrMap[n], values: matrix[sqrMap[n]][4]});
					dupes = dupes.concat(matrix[sqrMap[n]][4]);
				}

				cellSolution = dupes.getSingleItemValue();
				cellNumber = getCellCorrespondingToSingleValue(dupes.getSingleItemValue(), square);

				if (cellSolution !== 0) {
					//set cell
					sudoku[cellNumber] = cellSolution;
					iterations['options']++;
					setView();
				}
			}
		};

		var doDualOptions = function (options) {

			// If no dual options are found (that is, cells that have only 2 possible solutions)
			// then we are done, kaput, finito,
			if(options.length === 0){
				console.log('(b)puzzle cannot be solved');
				//$rootScope.$emit( "solutionFailure");
				//$scope.isDisabled = true;
				$scope.showErrorModal = true;
				return;
			}

			// Here we test the first cell having ONLY two options.
			// We should never have to change this index (0) since the program will move on the other simpler solution algorithms before returning
			// back to this method.
			optionTest = options[0];
			// Now use the first of the two possible solutions (firstOption)  -> test['options'][0]
			// If that does not work, then secondOption (test['options'][1]) MUST be the correct solution
			var firstOption = optionTest['options'][0];
			var secondOption = optionTest['options'][1];
			sudoku[optionTest['cell']] = firstOption;
			setNewCellValue();
			$scope.doSolution();
		};

		/**
		 * I say 'Brute Force' but what I mean is Knuth's Algorithm X. Thus we are at a point where a cell has two possible answers.
		 * The previous three methods are not able to determine an unambiguous answer unless a value is attempted and
		 * the algorithm proceeds to either success or failure.  If it succeeds, then the first value tested is correct.
		 * If it fails, then the untested value must be correct, and the program spins back into the previous three
		 * methods.
		 */
		var doBruteForceOptions = function () {
			var n;
			var testOptions = [];
			for (n = 0; n < clonedSudokuSolution.length; n++) {
				var cellData = {
					cellNumber: n,
					cellValue: clonedSudokuSolution[n][0],
					associatedColumn: clonedSudokuSolution[n][1],
					associatedRow: clonedSudokuSolution[n][2],
					associatedSquare: clonedSudokuSolution[n][3]
				};
				if (cellData['cellValue'] === 0) {
					doBruteForceComplex(cellData);
				}
			}

			// find the cells that have only two possible solutions
			for (n = 0; n < clonedSudokuSolution.length; n++) {
				var cell = clonedSudokuSolution[n];
				if (cell[0] === 0) {
					if (cell[4].length === 2) {
						testOptions.push({cell: n, options: cell[4]});
					}
				}
			}
			doDualOptions(testOptions);
		};


		/**
		 * Here we get into the feisty issue of restricting user input.
		 * We allow only numbers 1 to 9
		 * @param obj
		 */
		$scope.updateValue = function(obj){

			var updateNum = Number(obj.value);

			// here we place the number zero (0) into the array for any values outside of 1 to 9
			if(event.target.value === ''){
				event.target.value = null;
				updateNum = 0;
			} else if (event.keyCode === 48) {
				event.target.value = null;
				updateNum = 0;
			} else if (event.target.value.length > 1) {
				event.target.value = null;
				updateNum = 0;
			}

				sudoku[obj.cell] = updateNum;
				setNewCellValue();
		};


		/**
		 * This function links an action in the view to start solving the puzzle
		 * Additionally, this method will be called recursively as the algorithm
		 * attempts to solve the puzzle.
		 */
		$scope.doSolution = function () {

			if (!isStarted) {
				var startDate = new Date();
				startTime = startDate.getMilliseconds();
				solutionIterations = 0;
				isStarted = true;
				initialSudoku = sudoku.slice(0);// if the puzzle solver has gone to the trouble of adding a new puzzle, let's save it for them
			}

			var emptyCellNum = getNumberOpenCells();
			var emptyCellNumCopy = {value: 0};  // seed value

			// This, believe it or not, is the heart of the algorithm.
			// The code first runs 'doEasy()', followed by 'setNewCellValue()' to update the model.
			// Next is 'matrixCalculation()', then finally 'doOptions()'.  This continues until the number
			// of open cells is zero (puzzle complete) or the code runs over 100 iterations, meaning that
			// this algorithm cannot find a solution.  That doesn't mean one doesn't exist - it just means that
			// mine can't find it. Each method implements a different strategy to solve for a given cell.
			//The 'doOptions()' is really a variety of Knuth's Algorithm X, alsow known as 'Dancing Links' (DLX).
			while (emptyCellNum['value'] !== emptyCellNumCopy['value']) {
				emptyCellNumCopy = angular.copy(emptyCellNum);

				doEasy();
				setNewCellValue();

				matrixCalculation();
				setNewCellValue();

				doOptions();
				setNewCellValue();

				emptyCellNum = getNumberOpenCells();
				solutionIterations++;
			}

			console.log('number of open cells = ' + emptyCellNum['value'] + ' iterations = ' + solutionIterations);

			// Stop right there!  Don't go crazy on me!
			if (solutionIterations >= 100) {
				isStarted = false;
				doNoSolution();
				return;
			}

			if (emptyCellNum['value'] !== 0) {
				// create snapshot (clone) of solution to this point
				clonedSudokuSolution = matrix.slice(0);
				doBruteForceOptions();
			} else {
				// Is this a valid solution?
				if (checkSolution(sudoku)) {
					var endDate = new Date();
					endTime = endDate.getMilliseconds();
					var solveTime = endTime - startTime;
					console.log('total time to solve = ' + solveTime + ' ms');
					isStarted = false;
				} else {
					if(optionTest === undefined){
						isStarted = false;
						doNoSolution();
						return;
					}
					// That option test did not work, so reset to the state before the dual option test
					resetSudoku();
					// We know that the untested value MUST be the correct one, so let's insert it into the sudoku matrix
					var insertCell = optionTest['cell']; // the cell we are testing which has two possible answers
					sudoku[insertCell] = optionTest['options'][1]; // by default this value MUST be correct;
					setNewCellValue();
					$scope.doSolution();
				}
			}
		};

		$scope.doReset = function(){
			doNoSolution('reset');
			$rootScope.$emit('solutionReset');
		};

		/**
		 * Believe it or not, not all puzzles have a solution, or this algorithm can't find it.
		 * I could implement some more complex algorithms to solve expert puzzles, but being able to use angularjs
		 * to solve a *hard* puzzle was my goal.  Time to move on to other things.
		 */
		var doNoSolution = function (arg) {
			if(arg === undefined){
				console.log('(a)this puzzle cannot be solved');
				//$rootScope.$emit( "solutionFailure");
				$scope.showErrorModal = true;
				$scope.isDisabled = false;
			}else{
				console.log('reset puzzle');
			}
			// reset the puzzle back to the start state
			// we want to use the seed if the initialSudoku has been zero'd out
			var resetSudoku = initialSudoku;
			if(isBlank(initialSudoku)) {
				resetSudoku = seedSudoku;
			}

			for (var n = 0; n < sudoku.length; n++) {
				sudoku[n] = resetSudoku[n];
			}
			solutionIterations = 0;
			setNewCellValue();
		};

		/**
		 * test to see if the current state of the sudoku puzzle is blank (all zeros)
		 * if so, then we will re-use the initial seed sudoku puzzle
		 * @param matrix
		 * @returns {boolean}
		 */
		var isBlank = function(matrix){
			var test = false;
			var ndx = 0;
			for(var n=0; n<matrix.length; n++){
				if(matrix[n] === 0){
					ndx++;
				}
			}
			if(ndx === 81){
				test = true;
			}
			return test;
		}

		$rootScope.$on("enablePuzzle", function() {
			$scope.isDisabled = false;
		});

		$rootScope.$on("solve", function() {
			$scope.doSolution();
		});

		$rootScope.$on("reset", function() {
			$scope.doReset();
		});

		$rootScope.$on("clear", function() {
			doClear();
		});

		$rootScope.$on("check", function() {
			doCheck();
		});

		var doClear = function(){
			for(var n=0;n<sudoku.length;n++){
				sudoku[n] = 0;
			}
			$scope.isDisabled = false;
			setNewCellValue();
		};

		/**
		 * Granted, I could do A LOT more here, but 'Hey' there are a ZILLION sites
		 * devoted to Sudoku! I'm just doing this to satisfy my own curiosity
		 */
		var doCheck = function(){
			if(!checkSolution(sudoku)) {
				$scope.showErrorModal = true;
			}else{
				$scope.showCheckModal = true;
			}


		}

		/**
		 * We take the sudoku array we cloned (stored) before we started the dual option test
		 * and use that to reset it back to that state.
		 */
		var resetSudoku = function () {
			sudoku = [];
			for (var n = 0; n < clonedSudokuSolution.length; n++) {
				sudoku[n] = clonedSudokuSolution[n][0];
			}
		};

		/**
		 * Check each row, column and square individually for multi-occurrence of values 1 to 9
		 */
		var checkSolution = function (solution) {
			var n = 0;
			var isSolution = true;

			for (n = 0; n < rows.length; n++) {
				if (!checkMultiOccurrence(rows[n])) {
					isSolution = false;
					break;
				}
			}

			for (n = 0; n < columns.length; n++) {
				if (!checkMultiOccurrence(columns[n])) {
					isSolution = false;
					break;
				}
			}

			for (n = 0; n < squares.length; n++) {
				if (!checkMultiOccurrence(squares[n])) {
					isSolution = false;
					break;
				}
			}
			return isSolution;
		};

		var checkMultiOccurrence = function (arr) {
			var a = [], b = [], prev, isSolution = true, n = 0;
			var tmp = arr.slice(0); // we don't want to muck up the arr that currently represents the model
			tmp.sort();
			for (var i = 0; i < tmp.length; i++) {
				if (tmp[i] !== prev) {
					a.push(tmp[i]);
					b.push(1);
				} else {
					b[b.length - 1]++;
				}
				prev = tmp[i];
			}

			for (n = 0; n < b.length; n++) {
				if (b[n] > 1) {
					isSolution = false;
					break;
				}
			}
			return isSolution;
		}

		/**
		 * Whenever a cell value is solved, all the associated columns, rows and squares need to be updated
		 * Additionally, the *view* (the html) is updated to show the changes.
		 */
		var setNewCellValue = function () {
			setColumns();
			setRows();
			setSquares();
			setCells();
			setOptions();
			setMatrix();
			setView();
		};

		/**
		 * Upon initalize() the model and view are seeded with the starting puzzle.
		 * The user is welcome to modify the view.  This will update the model - but
		 * there is no guarantee that a solution will be found.
		 */
		var initialize = function () {
			setSudoku();
			setColumns();
			setRows();
			setSquares();
			setCells();
			setOptions();
			setMatrix();
			setView();



		};


		// And here we start the ball rolling ...
		initialize();
	}])

	.controller('alertCtrl', ['$scope','$rootScope', function ($scope,$rootScope) {
		$scope.alertFlag = 'hidden';

		$rootScope.$on("solutionFailure", function() {
			$scope.alertFlag = 'visible';
		});

		$rootScope.$on("solutionReset", function() {
			$scope.alertFlag = 'hidden';
		});

		$scope.doClose = function(){
			$scope.alertFlag = 'hidden';
			$rootScope.$emit('enablePuzzle');
		}

		$rootScope.$on("hideAlert", function() {
			$scope.alertFlag = 'hidden';
		});

	}])

	.controller('toolCtrl', ['$scope','$rootScope','$interval', function ($scope,$rootScope,$interval) {

		var isClicked = false;
		var isVisible = true;
		$scope.isVisible = 'visible';
		$scope.about = 'about';


		$scope.doClick = function(){
			if(!isClicked){
				TweenMax.to('.tools',1,{delay:0.0, x:-100, ease:Bounce.easeOut});
			}else{
				TweenMax.to('.tools',0.25,{delay:0.0, x:0});
			}
			isClicked = !isClicked;
		};

		$scope.optionClick = function(arg){
			switch(arg){
				case 'solve':
					$rootScope.$emit('solve');
					$rootScope.$emit('hideAlert');
					break;

				case 'clear':
					$rootScope.$emit('clear');
					$rootScope.$emit('hideAlert');
					break;

				case 'reset':
					$rootScope.$emit('reset');
					$rootScope.$emit('hideAlert');
					break;

				case 'check':
					$rootScope.$emit('check');
					break;

				case 'about':
					$rootScope.$emit('about');
					(isVisible)?$scope.isVisible = 'hidden':$scope.isVisible = 'visible';
					(isVisible)?$scope.about = 'close':$scope.about = 'about';
					isVisible = !isVisible;
					$rootScope.$emit('hideAlert');
					break;
			}
		}

		var init = function() {
			var ndx = 0;
			var timer=$interval(function(){
				($scope.tab === 'tab' ? $scope.tab = 'tabAlt' : $scope.tab = 'tab');
				ndx++;
				if(ndx >= 21){
					$interval.cancel(timer);
					timer=undefined;
				}
			},200);
		};

		init();

	}])

	.controller('aboutCtrl', ['$scope','$rootScope', function ($scope,$rootScope) {

		$scope.isAboutVisible = 'hidden';

		$scope.info = "ngSudoko is my implementation of a solution to hard Sudoku puzzles using Angularjs.  I first took on this " +
			"challenge in spring 2015 as a way to get familiar with the AngularJS framework.  My first draft was ... meh ... not " +
			"so great.  I struggled with developing a crisp way to update both the view and the model.  Since the bulk of my experience " +
			"is in Flex (Actionscript), and Java methodologies, I encountered some difficulties.  I let this code lay fallow for the summer " +
			"as I moved on to other challenges.  This fall I picked up where I left off, and re-evaluated my approach.\n\nI focused first on " +
			"creating a well organized and robust model to represent the sudoku grid.  Then I added layers of algorithms to solve for the " +
			"empty cells.  The strategies for solving Sudoku are well known, and there a sites devoted to these methods.  Any beginner Sudoku solver will " +
			"intuitively employ these methods, however the challenge to me was creating an algorithm that encapsulate these strategies.  The last stage " +
			"in my algorithm uses what is termed 'dancing links' or DLX, which is essentially a backtracking algorithm.\n\nOnce I knew the code " +
			"worked, I set out to create a user-friendly web interface view. I knew I had an algorithm that worked, I just wasn't sure how " +
			"to get that information in or out.  I was trusting that Angularjs was sufficiently decoupled in it's MVC implementation that I would have " +
			"the flexibility to integrate with the underlying model.  It did.\n\nHere is the final product.  You can see the code at https://github.com/mcorbridge/ngsudoku.\n\n" +
			"Michael Corbridge\nOctober 2015"

		var isClicked = false;

		$rootScope.$on('about', function() {
			if(!isClicked){
				$scope.isAboutVisible = 'visible';
			}else{
				$scope.isAboutVisible = 'hidden';
			}
			isClicked = !isClicked;
		});

	}])

	.directive('modal', function () {
		return {
			template: '<div class="modal fade" style="top:300px">' +
			'<div class="modal-dialog">' +
			'<div class="modal-content">' +
			'<div class="modal-header">' +
			'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
			'<h4 class="modal-title">{{ title }}</h4>' +
			'</div>' +
			'<div class="modal-body" ng-transclude></div>' +
			'</div>' +
			'</div>' +
			'</div>',
			restrict: 'E',
			transclude: true,
			replace:true,
			scope:true,
			link: function postLink(scope, element, attrs) {
				scope.title = attrs.title;

				scope.$watch(attrs.visible, function(value){
					if(value == true)
						$(element).modal('show');
					else
						$(element).modal('hide');
				});

				$(element).on('shown.bs.modal', function(){
					scope.$apply(function(){
						scope.$parent[attrs.visible] = true;
					});
				});

				$(element).on('hidden.bs.modal', function(){
					scope.$apply(function(){
						scope.$parent[attrs.visible] = false;
					});
				});
			}
		};
	});

