export class Problem
{
	constructor(ctx)
	{
		this.ctx = ctx;
		this.user_answer = null;
	}

	update_user_answer(answer)
	{
		this.user_answer = answer;
		this.ctx.check_answers();
	}

	answer_is_correct()
	{
		return this.user_answer && this.answer.obj_equals(this.user_answer);
	}
}

if (typeof exports !== "undefined")
{
	exports.Problem = Problem;
}