
'use strict';

// Mobile Navigation
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

if (toggle && nav) {

    // Open or close the mobile navigation
    toggle.addEventListener('click', () => {

        const expanded =
            toggle.getAttribute('aria-expanded') === 'true';

        toggle.setAttribute(
            'aria-expanded',
            String(!expanded)
        );

        nav.classList.toggle('open', !expanded);

    });

    // Close the mobile navigation when a link is selected
    nav.addEventListener('click', event => {

        if (event.target.closest('a')) {

            toggle.setAttribute('aria-expanded', 'false');

            nav.classList.remove('open');

        }

    });

}


// Consultation Form
const form = document.querySelector('#consultation-form');

if (form) {

    const fields = [
        ...form.querySelectorAll('input[required],select[required]')
    ];

    const feedback = document.querySelector('#form-feedback');


    // Validate an individual form field
    function validate(field) {

        const error = document.querySelector(
            '#' + field.id + '-error'
        );

        let message = '';

        // Required field validation
        if (!field.value.trim()) {

            message = 'This field is required.';

        }

        // Email address validation
        else if (
            field.type === 'email' &&
            !field.validity.valid
        ) {

            message = 'Enter a valid email address.';

        }

        // Phone number validation
        else if (
            field.type === 'tel' &&
            field.value.replace(/\D/g, '').length < 7
        ) {

            message = 'Enter a valid phone number.';

        }

        // Update accessibility attributes
        field.setAttribute(
            'aria-invalid',
            String(Boolean(message))
        );

        if (message) {

            field.setAttribute(
                'aria-describedby',
                error.id
            );

        } else {

            field.removeAttribute('aria-describedby');

        }

        // Display or clear the validation message
        error.textContent = message;

        return !message;

    }


    // Attach validation events to each required field
    fields.forEach(field => {

        // Validate when the user leaves a field
        field.addEventListener('blur', () => {

            validate(field);

        });

        // Revalidate an invalid field as the user types
        field.addEventListener('input', () => {

            if (
                field.getAttribute('aria-invalid') === 'true'
            ) {

                validate(field);

            }

        });

        // Validate when a field's value changes
        field.addEventListener('change', () => {

            validate(field);

        });

    });


    // Handle Consultation Form Submission
    form.addEventListener('submit', event => {

        // Prevent an actual form submission
        event.preventDefault();

        // Hide any previous confirmation
        feedback.hidden = true;

        // Validate all required fields
        const valid = fields.map(validate).every(Boolean);

        // Focus the first invalid field
        if (!valid) {

            fields.find(
                f => f.getAttribute('aria-invalid') === 'true'
            )?.focus();

            return;

        }

        // Display prototype confirmation
        feedback.innerHTML =
            '<strong>Prototype confirmation</strong>' +
            '<p>Your example consultation request is complete. ' +
            'In a live website, Paradigm would contact you within ' +
            '48 hours to schedule a consultation. ' +
            'No information was sent or stored.</p>';

        feedback.hidden = false;

        // Move keyboard focus to the confirmation
        feedback.focus();

    });

}