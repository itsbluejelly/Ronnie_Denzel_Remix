// A GENERIC TO CREATE AN OBJECT TYPE
export type ObjectGenerator<KeyType extends string | number, ValueType> = {
    [key in KeyType]: ValueType
}

// A GENERIC TO REVEAL ALL KEYS IN AN OBJECT
export type Prettier<ObjectType extends object> = {
    [key in keyof ObjectType]: ObjectType[key]
}

// A GENERIC TO MAKE ALL KEYS IN AN OBJECT OPTIONAL
export type OptionalGenerator<ObjectType extends object> = {
	[key in keyof ObjectType]?: ObjectType[key]
}

// A GENERIC TO EXCLUDE A KEY IN AN OBJECT
export type Excluder<ObjectType extends object, ExcludedKey extends keyof ObjectType> = {
    [key in keyof ObjectType as key extends ExcludedKey ? never : key]: ObjectType[key]
}