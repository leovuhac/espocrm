/************************************************************************
 * This file is part of EspoCRM.
 *
 * EspoCRM - Open Source CRM application.
 * Copyright (C) 2014-2023 Yurii Kuznietsov, Taras Machyshyn, Oleksii Avramenko
 * Website: https://www.espocrm.com
 *
 * EspoCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * EspoCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EspoCRM. If not, see http://www.gnu.org/licenses/.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "EspoCRM" word.
 ************************************************************************/

define('views/admin/field-manager/fields/options/default-multi', ['views/fields/multi-enum'], function (Dep) {

    // noinspection JSUnusedGlobalSymbols
    return Dep.extend({

        setup: function () {
            Dep.prototype.setup.call(this);

            this.validations.push('listed');

            this.updateAvailableOptions();

            this.listenTo(this.model, 'change', () => {
                if (
                    !this.model.hasChanged('options') &&
                    !this.model.hasChanged('optionsReference')
                ) {
                    return;
                }

                this.updateAvailableOptions();
            });
        },

        updateAvailableOptions: function () {
            this.setOptionList(this.getAvailableOptions());
        },

        getAvailableOptions: function () {
            const optionsReference = this.model.get('optionsReference');

            if (optionsReference) {
                const [entityType, field] = optionsReference.split('.');

                const options = this.getMetadata()
                    .get(`entityDefs.${entityType}.fields.${field}.options`) || [];

                return Espo.Utils.clone(options);
            }

            return this.model.get('options') || [];
        },

        validateListed: function () {
            /** @type string[] */
            const values = this.model.get(this.name) ?? [];

            if (!this.params.options) {
                return false;
            }

            const options = this.getAvailableOptions();

            for (const value of values) {
                if (options.indexOf(value) === -1) {
                    const msg = this.translate('fieldInvalid', 'messages')
                        .replace('{field}', this.getLabelText());

                    this.showValidationMessage(msg);

                    return true;
                }
            }

            return false;
        },
    });
});
