import Exercise  from './Exercise.js';
const FRACT_INC_W = 5;
const FRACT_BASE_W = 5;
const HINT_INC_W = 40;
const HINT_BASE_W = 40;
const FRACT_GAP = 0;
const FRACT_PAD = 15;

export default {
	mixins: [Exercise],
	methods: {
		fix_styles() {
			let fract_w = this.fract_width();
			let hint_w = this.hint_width();
			let props = { width: fract_w};
			let props_hint = {width: hint_w};
			let props_right = {...props, left: fract_w + FRACT_GAP};
			let props_fract_line = {...props, left: fract_w};
			this.fix_styles_for_class("whole_part", props);
			this.fix_styles_for_class("numerator", props_right);
			this.fix_styles_for_class("fract_line", props_fract_line);
			this.fix_styles_for_class("denominator", props_right);
			this.fix_styles_for_class("hint", props_hint);
			this.fix_styles_for_class("fract_w_sign", {width: fract_w * 2 + FRACT_GAP + FRACT_PAD});
			console.log("hint_fract_container", props_hint);
		},
		get_style(cl) {
			let props = this.props_by_class[cl];
			if (!props)
				return "";
			let style = Object.keys(props).map(k => k + ":" + props[k]).join(";");
			return style;
		},
		fract_width: function () {
			let max_val_length = this.max_val.toString().length;
			return max_val_length * FRACT_INC_W + FRACT_BASE_W;
		},
		hint_width: function() {
			return this.n_terms * HINT_INC_W + HINT_BASE_W;
		}
	}
}
