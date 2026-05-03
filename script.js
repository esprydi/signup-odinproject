document.addEventListener('DOMContentLoaded', function () {
	const form = document.querySelector('form.form');
	if (!form) return;

	const password = form.querySelector('#password');
	const confirm = form.querySelector('#confirm-password');

	function clearError(el) {
		el.classList.remove('invalid');
		el.removeAttribute('aria-invalid');
	}

	function markInvalid(el, msg) {
		el.classList.add('invalid');
		el.setAttribute('aria-invalid', 'true');
		if (msg) el.setCustomValidity(msg);
	}

	// live clear on input
	[password, confirm].forEach((inp) => {
		if (!inp) return;
		inp.addEventListener('input', () => {
			clearError(inp);
			inp.setCustomValidity('');
		});
	});

	// immediate check for confirm password while typing
	if (confirm && password) {
		// helper to show inline error element
		function showConfirmError(msg) {
			let el = confirm.nextElementSibling;
			if (!el || !el.classList || !el.classList.contains('error-message')) {
				el = document.createElement('div');
				el.className = 'error-message';
				confirm.parentNode.insertBefore(el, confirm.nextSibling);
			}
			el.textContent = msg;
			confirm.classList.add('invalid');
			confirm.setAttribute('aria-invalid', 'true');
			confirm.setCustomValidity(msg);
		}

		function clearConfirmError() {
			let el = confirm.nextElementSibling;
			if (el && el.classList && el.classList.contains('error-message')) el.textContent = '';
			confirm.classList.remove('invalid');
			confirm.removeAttribute('aria-invalid');
			confirm.setCustomValidity('');
		}

		confirm.addEventListener('input', function () {
			if (confirm.value.length === 0) {
				clearConfirmError();
				return;
			}
			if (password.value !== confirm.value) {
				showConfirmError('Passwords do not match');
			} else {
				clearConfirmError();
			}
		});

		// also check on blur to ensure user sees message when finishing typing
		confirm.addEventListener('blur', function () {
			if (confirm.value && password.value !== confirm.value) {
				showConfirmError('Passwords do not match');
			}
		});
	}

	// when user submits, mark form as validated so :invalid styles show
	form.addEventListener('submit', function (e) {
		form.classList.add('validated');

		// let browser run basic validity first
		if (!form.checkValidity()) {
			// allow browser to show native errors
			return;
		}

		// custom check: passwords must match
		if (password && confirm && password.value !== confirm.value) {
			e.preventDefault();
			markInvalid(confirm, 'Passwords do not match');
			confirm.reportValidity();
			confirm.focus();
			return false;
		}

		// form is valid and passwords match — submit normally
	});

	// remove validated class when form becomes valid on input
	form.addEventListener('input', function () {
		if (form.checkValidity()) form.classList.remove('validated');
	});
});

