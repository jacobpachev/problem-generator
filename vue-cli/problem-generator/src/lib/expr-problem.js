import {Problem} from './problem';
import {interval_rand} from './util';

export class ExprProblem extends Problem
{
	constructor (ctx)
	{
		super(ctx);
		this.ctx = ctx;
		this.expr = this.gen_expr();
		this.result = {};
		this.user_answer = null;
	}

	answer_is_correct()
	{
		return this.user_answer && this.expr.ans == (this.user_answer);
	}

	gen_expr()
	{
		throw "gen_expr() must be implemented in the derived class";
	}

	get_var_by_ind(ind)
	{
		return String.fromCharCode(ind + 97); // 'a' + ind
	}

	// TODO: probably needs a better name
	gen_term()
	{
		let s = "";

		// n_terms is really the number of variables in a term here
		for (let i = 0; i < this.ctx.n_terms; i++)
		{
			if (s.length)
				s += "*";
			s += this.get_var_by_ind(i) + "^" + interval_rand(-this.ctx.max_val, this.ctx.max_val);
		}

		return interval_rand(-this.ctx.max_val, this.ctx.max_val) + " * " + s;
	}
}

export class RatioPowerExprProblem extends ExprProblem
{
	constructor(ctx)
	{
		super(ctx);
	}

	gen_expr()
	{
		return this.gen_term() + "/(" + this.gen_term() + ")";
	}
}
