export class AssetModel {
  constructor({
    assetId, assetNo, assetName, categoryName, statusName
  }) {
    this.assetId = assetId;
    this.assetNo = assetNo;
    this.assetName = assetName;
    this.categoryName = categoryName;
    this.statusName = statusName;
  }
}
