# ngSudoku - An AngularJS app for solving hard Sudoku puzzles

Sudoku provides a good programming challenge to implement algorithms to solve the empty cells in
 a 9 x 9 classic Sudoko matrix.  There are a number of sites that provide details in solution strategies, but for the novice, all that  is
 required is the patience to sit down and logically work through combinations until the final objective is met.  I might 
 be simplifying a bit.  Solving a hard Sudoku puzzle requires logical-deduction and thorough hypothesis testing involving
 inclusion, exclusion, and tandem inclusion-exclusion.  My wife is a wizard at it.  Me?  Not so much.  But I was interested
 in encapsulating the process in which the human mind comes to the logical conclusion that there is only one possible
 solution for a particular open cell.  In some cases, where either a row, column, or square is populated with eight numbers,
 the answer is clear.  In all other cases, players execute a series of strategies to zero in on the answer.   Here is my answer to the 
 challenge.  The algorithm in app.js can solve a hard Sudoku puzzle in a matter of milliseconds.  I'm not sure if that
 gives me bragging rights over my wife, but it did expose me to the fundamentals of how the AngularJS framework implements MVC,
 and is an excellent primer to dependency injection.
