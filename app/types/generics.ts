/**
 * A Generic to create an object type
 * @param KeyType the key or union of keys the object type should have
 * @param ValueType the type of value all those keys should have
 */
export type ObjectGenerator<KeyType extends string | number, ValueType> = {
	[key in KeyType]: ValueType
}

/**
 * A Generic to reveal all keys in an object type
 * @param ObjectType The object Type to work on
 */
export type Prettier<ObjectType extends object> = {
	[key in keyof ObjectType]: ObjectType[key]
}

/**
 * A Generic to make all keys in an object type optional
 * @param ObjectType The object Type to work on
 */
export type OptionalGenerator<ObjectType extends object> = {
	[key in keyof ObjectType]?: ObjectType[key]
}

/**
 * A Generic to exclude a key in an object
 * @param ObjectType The object Type to work on
 * @param ExludedKey the key to remove
*/
export type Excluder<
	ObjectType extends object,
	ExcludedKey extends keyof ObjectType
> = {
	[key in keyof ObjectType as key extends ExcludedKey
		? never
		: key]: ObjectType[key]
}

/**
 * A Generic to pick a key from an object
 * @param ObjectType The object Type to work on
 * @param InludedKey the key to retain
*/
export type Picker<
	ObjectType extends object,
	IncludedKey extends keyof ObjectType
> = {
	[key in keyof ObjectType as key extends IncludedKey
		? key
		: never]: ObjectType[key]
}
