<template>
		<div v-if="inited()">
			<DynamicSpan :id="animateid" :cl="hint_cl()" :root="root">
				<template v-if="problem">
					<template v-if="problem.is('FractProblem')">
						<FractProblemStatement :root="root" :data="problem"/>
					</template>
					<template v-if="problem.is('LinearEquationProblem')">
						<div class="hint-equation-wrap">
							<LinearEquation :root="root" :eq="problem.eq"/>
						</div>
					</template>
					<template v-if="problem.is_expr()">
						<div class="hint-equation-wrap">
							<vue-mathjax :formula="'$$' + problem.expr.tex + '$$'"/>
						</div>
					</template>
				</template>
				<template v-else>
					<div class="hint_op_container">
						<span v-if="can_render_direct()">{{this.a}}&nbsp;{{this.op}}&nbsp;{{this.b}}</span>
						<span v-else-if="op == '**' "><Pow :a="a" :b="b" /></span>
						<span v-else-if="op == 'sum_sq' "><Pow :a="a" b="2" />&nbsp;+&nbsp;<Pow :a="b" b="2"/></span>
						<span v-else-if="op == 'table_sq'"><Pow :a="get_square_base()" b="2" /></span>
						<span v-else-if="op == 'trig'">{{this.a}}({{this.b}}<sup>&#8728;</sup>)</span>
						<span v-else-if="op == 'log'">log<sub>{{this.a}}</sub>({{this.b}})</span>
					</div>
				</template>
				<Star animateid="star" v-if="show_star" :key="star_key()" :root="root" :top="cur_top" :left="cur_left"/>
					<div class="parachute">
						<svg xmlns="http://www.w3.org/2000/svg" width="180">
						<path d="M10,50 a1,1 0 0,1 100,0" fill="red" stroke="red" stroke-width="0"/>
						<line x1="70" y1="150" x2="108" y2="50" stroke="black" />
						<line x1="12" y1="50" x2="60" y2="150" stroke="black" />

						<line x1="40" y1="50" x2="60" y2="150" stroke="black" />
						<line x1="80" y1="50" x2="70" y2="150" stroke="black" />
						</svg>
					</div>
			</DynamicSpan>
		</div>
</template>
<script>

import Animated from './Animated.js';

import Pow from './Pow.vue';
import Star from './Star.vue';
import FractProblemStatement from './FractProblemStatement.vue';
import LinearEquation from './LinearEquation.vue';
import DynamicSpan from './DynamicSpan.vue';
import {VueMathjax} from "vue-mathjax";

const FRAME_STEP = 1;
const FINAL_TOP = 400;

export default {
	name: 'Hint',
	mixins: [Animated],
	components: {Pow, Star, FractProblemStatement, DynamicSpan, LinearEquation,
		"vue-mathjax" : VueMathjax},
	props: ['root', 'op', 'problem', 'animateid'],
	data() {
		return {
			a: null,
			b: null,
			timer: null,
			show_star: false,
			star_counter: 1,
		}
	},
	mounted() {
		this.root.hint = this;
	},
	computed: {
		cur_left() { return this.pos.left},
		cur_top() { return this.pos.top}
	},
	methods: {
		hint_cl() {
			switch(this.root.mode) {
				default:
					return "hint";
				case "power_ratio_expr":
					return "power-ratio-expr-hint";
			}
		},
		star_key() {
			return "star-key-" + this.start_counter;
		},
		should_stop() {
			return this.pos.top >= FINAL_TOP;
		},
		run_frame_step() {
			let mode = this.root.mode;
			let frame_step = FRAME_STEP;

			switch (mode)
			{
				case "linear":
					frame_step = 0.5;
					break;
				case "fract":
				case "power_ratio_expr":
					frame_step = 0.3;
					break;
				case "log":
					frame_step = 0.25;
					break;
				default:
					break;
			}

			this.pos.top += frame_step;
		},
		stop_star() {
			this.show_star = false;
			this.root.stop_star();
		},
		on_start() {
			this.star_counter++;
			let cur_star_counter = this.star_counter;

			setTimeout(() => {
				if (cur_star_counter == this.star_counter)
					this.stop_star();
			}, 3000);
		},
		get_square_base() {
			let res = this.b.toString();
			if (this.a)
				res = this.a.toString() + res;
			return res;
		},
		can_render_direct() {
			switch (this.op)
			{
				case 'sum_sq':
				case 'table_sq':
				case '**':
				case 'log':
				case 'trig':
					return false;
				default:
					return true;
			}
		},
		handle_success() {
			let was_running = this.timer;
			this.stop();
			this.reset();
			if (was_running)
			{
				this.show_star = true;
				this.root.stop_star();
				this.root.animate_star();
			}
			console.log("Handling success");
		},
		update(a,b) {
			this.a = a;
			this.b = b;
			this.animate();
		},
		inited() {
			return this.problem || (this.a !== null && this.b !== null);
		}
	}

}
</script>
