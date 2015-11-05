/**
 * Created by Mike on 11/5/2015.
 */

angular.module('data', [])

	.factory('aboutInfo', function(){
	return {
		version0: function(){
			return "ngSudoko is my implementation of a solution to hard Sudoku puzzles using Angularjs.  I first took on this " +
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
				"Michael Corbridge\nOctober 2015";
		},
		version1: function(){
			return "ngSudoku is my implementation of a Javascript solution to hard Sudoku puzzles, and the creation of a web interface " +
				"in the Angularjs framework.\n\nMy goal was to both learn Angularjs, and to enhance my HTML5 frontend " +
				"skills, and is not intended to challenge the zillion far superior Sudoku apps that already exist. Since my background " +
				"is primarily in object oriented languages such as Java (Android), and Actionscript3.0 (Flex), I simply felt " +
				"this would be an opportunity to learn how performant Angularjs is.\n\nI initially became interested in Sudoku after watching my wife solving the hard puzzles.  Although there are " +
				"many sites devoted to Sudoku solution strategies, she eschewed them all and simply sat down and figured it out.  Judging from " +
				"the legion of Sudoku fans, this type of puzzle is a popular form of relaxation, but what algorithms did the human mind intuitively employ " +
				"to find the answer?\n\nI found this intriguing, and proceeded to encapsulate these algorithms in Javascript.  My journey took me " +
				"into interesting territory as I learned about NP-Complete problems, and DLX or 'Dancing Links' backtracking algorithms.\n\nSudoku is " +
				"an excellent example of classic non-linear continuous dynamics problems.  All that mouthful means is that solutions are hard to find " +
				"but easy to check.  This is not trivial, and is one of the Millennium Prize Problems to which a correct solution wins you " +
				"$1,000,000 (USD).\n\nMy algorithms, by the way, are not a correct solution of 'P versus NP', but you can see the code anyway at:\n\n\ https://github.com/mcorbridge/ngsudoku.\n\n" +
				"Michael Corbridge\nOctober 2015";
		}
	}
});