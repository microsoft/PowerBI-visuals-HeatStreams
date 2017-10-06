// tslint:disable no-var-requires
import { ICategory } from './chart/interfaces'
import buildDomainScrub from './data/buildDomainScrub'
const get = require('lodash/get')
const logger = require('./logger')

export default class Interactions {
	constructor(
		private host: powerbi.extensibility.visual.IVisualHost,
		private selectionManager: powerbi.extensibility.ISelectionManager,
	) {}

	public async clearSelections() {
		logger.info('Handle Clear')
		await this.selectionManager.clear()
		this.applyFilter(null)
		this.persistSelectedCategories([])
	}

	public async selectCategory(
		category: ICategory,
		multiselect: boolean,
		dataView: powerbi.DataView,
	) {
		logger.info('Handle Cat Click', category, multiselect)
		const selection = this.selectionIdForCategory(category, dataView)
		await this.selectionManager.select(selection, multiselect)
		this.persistSelectedCategories([category.id])
	}

	public async scrub(bounds: Array<Date | number>, dv: powerbi.DataView) {
		logger.info('Handle Scrub', bounds)
		if (bounds === null || bounds === undefined || +bounds[0] === +bounds[1]) {
			this.applyFilter(null)
			return
		}
		const column = dv.metadata.columns.find(col => col.roles.grouping)
		const filter = buildDomainScrub(bounds, column.identityExprs[0])
		this.applyFilter(filter)
	}

	private selectionIdForCategory(category: ICategory, dv: powerbi.DataView) {
		const categoryColumn = get(dv, 'categorical.categories[0]', [])
		return this.host
			.createSelectionIdBuilder()
			.withCategory(categoryColumn, category.id)
			.createSelectionId()
	}

	private applyFilter(filter) {
		this.host.applyJsonFilter(filter, 'data', 'filter')
	}

	private persistSelectedCategories(categories) {
		// This isn't used yet, but PersistProperties fires the update cycle, which lets selections pipe through
		this.host.persistProperties({
			merge: [
				{
					objectName: 'data',
					properties: {
						selectedCategories: JSON.stringify(categories),
					},
					selector: null,
				},
			],
		})
	}
}
