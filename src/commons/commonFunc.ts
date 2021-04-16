export const LetterCapitalize = (str = '') => {
  str = (str || '').toLowerCase().trim()
  return str.split(' ').map(item => item.substring(0, 1).toUpperCase() + item.substring(1)).join(' ')
}

export const toAcronym = (str = '') => {
  const res = (str || '').toLowerCase().trim()
  return res.split(' ').map(i => i[0]).join('')
}

export const toUnsignedName = (str = '') => {
  let resStr = str.toLowerCase().trim()
  resStr = resStr.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/gi, 'a')
  resStr = resStr.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/gi, 'e')
  resStr = resStr.replace(/ì|í|ị|ỉ|ĩ/gi, 'i')
  resStr = resStr.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/gi, 'o')
  resStr = resStr.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/gi, 'u')
  resStr = resStr.replace(/ỳ|ý|ỵ|ỷ|ỹ/gi, 'y')
  resStr = resStr.replace(/đ/gi, 'd')
  resStr = resStr.replace(/\s+/g, ' ');
  return resStr
}

/*
test = {
  _id: 1,
  children: [
    _id: 2,
    children: [
      _id: 3
    ]
  ]
}
getPath(test, 3) = [
  {
    _id: 1
  },
  {
    _id: 2
  },
  {
    _id: 3
  }
]
*/
export const getPath = (model, id) => {
  let path
  const item = model
  if (!model || typeof model !== 'object') {
    return
  }
  if (model._id === id) {
    return [item]
  }
  (model.children || []).some(child => path = getPath(child, id))
  return path && [item, ...path]
}

/*
test = [
  {
    _id: 1,
    idParent: 2
  },
  {
    _id: 2
  }
]
listToTree(test) = [
  {
    _id: 2
    children: {
      _id: 1
    }
  }
]
*/
export const listToTree = (list) => {
  const map = {}
  let organization
  const roots = []
  let i
  for (i = 0; i < list.length; i += 1) {
    map[list[i]._id] = i // initialize the map
    list[i].children = [] // initialize the children
  }
  for (i = 0; i < list.length; i += 1) {
    organization = list[i]
    if (organization.idParent !== null && organization.idParent !== undefined) {
      // if you have dangling branches check that map[organization.parentId] exists
      list[map[organization.idParent]].children.push({ ...organization, expanded: true })
    } else {
      roots.push({ ...organization, isDirectory: true, expanded: true })
    }
  }
  return roots
}

export const mathRound500 = number => {
  return number % 500 !== 0 ? (Math.floor(number / 500) + 1) * 500 : number
}


export const dotNotate = (obj, target = null, prefix = '') => {
  target = target || {}
  prefix = prefix || ""

  Object.keys(obj).forEach(key => {
    if (!(typeof obj[key] === 'object' && obj[key] && !Array.isArray(obj[key]))) return (target[prefix + key] = obj[key])
    dotNotate(obj[key], target, prefix + key + '.')
  })
  return target
}