/**
 * Created by horia_000 on 21-Oct-15.
 */
window.onkeydown = checkKey;

function checkKey(ev) {
	console.log(ev.keyCode);
	switch (ev.keyCode) {
		// -
		case 173:
		case 109:
		{
			if (maxIntermediaryPoints > 1) {
				--maxIntermediaryPoints;
			}
			initBuffers();
			break;
		}
		// 1
		case 49:
		{
			controlPointSelector = 1;
			break;
		}
		// 2
		case 50:
		{
			controlPointSelector = 2;
			break;
		}
		// 3
		case 51:
		{
			if (maxIntermediaryPoints < 20) {
				++maxIntermediaryPoints;
			}
			maxIntermediaryPoints++;
			initBuffers();
			break;
		}

		// a
		case 65:
		{
			if (controlPointSelector == 1) {
				points[3] -= 0.01;
			} else if (controlPointSelector == 2) {
				points[6] -= 0.01;
			}
			initBuffers();
			break;
		}
		// d
		case 68:
		{
			if (controlPointSelector == 1) {
				points[3] += 0.01;
			} else if (controlPointSelector == 2) {
				points[6] += 0.01;
			}
			initBuffers();
			break;
		}
		// w
		case 87:
		{
			if (controlPointSelector == 1) {
				points[4] += 0.01;
			} else if (controlPointSelector == 2) {
				points[7] += 0.01;
			}
			initBuffers();
			break;
		}
		// s
		case 83:
		{
			if (controlPointSelector == 1) {
				points[4] -= 0.01;
			} else if (controlPointSelector == 2) {
				points[7] -= 0.01;
			}
			initBuffers();
			break;
		}
		// q
		case 81:
		{
			enableQuadratic = !enableQuadratic;
			break;
		}
		default:
			console.log("Bad key pressed :" + ev.keyCode);
			break;
	}
}