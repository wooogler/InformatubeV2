const dot = (vec1, vec2) => {
  let result = 0
  for(let i=0;i<vec1.length;i++) {
    result += vec1[i]*vec2[i];
  }
  return result;
}

const sum = (vec) => {
  return vec.reduce((a,b) => a+b,0);
}

const sim = (vec1, vec2) => {
  const cor = dot(vec1, vec2);
  const vec1_abs = Math.sqrt(vec1.reduce((sum,i) => sum+i*i,0));
  const vec2_abs = Math.sqrt(vec2.reduce((sum,i) => sum+i*i,0));
  return cor/(vec1_abs*vec2_abs);
}

const normalizeMatrix = (mat) => {
  for(let i=0;i<mat[0].length; i++){
    let mag=0
    for(let j=0;j<mat.length; j++) {
      mag += mat[j][i]*mat[j][i]
    }
    mag = Math.sqrt(mag)
    for(let j=0;j<mat.length; j++) {
      mat[j][i] = mat[j][i] / mag
    }
  }
  return mat;
}

const createSimilarityMatrix = (mat) => {
  let sim_mat = [];
  mat.forEach((row_i) => {
    let sim_row = [];
    mat.forEach((row_j) => {
      sim_row.push(sim(row_i,row_j));
    })
    sim_mat.push(sim_row);
  })
  return sim_mat;
}

const transpose = (matrix) => {
  return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

const cf = (matrix) => {
  const mat = normalizeMatrix(matrix);
  const sim_mat = createSimilarityMatrix(mat);
  console.log(mat);
  console.log(sim_mat);
  const user_mat = transpose(mat);
  let result = [];
  for (let i=0; i<user_mat.length; i++) {
    let user_sim = [];
    for(let j=0; j<sim_mat.length; j++) {
      user_sim.push(dot(user_mat[i],sim_mat[j])/sum(sim_mat[j]))
    }
    result.push(user_sim);
  }
  return result;
}

export const userOrder = (matrix, user_eval) => {
  console.log('before', matrix);
  console.log('user_eval', user_eval);
  matrix.forEach((row, i) => {
    row.push(user_eval[i])
  })
  console.log('after', matrix);
  console.log('cf',cf(matrix));
  const new_matrix = cf(matrix);
  console.log('new_matrix', new_matrix);
  return new_matrix[new_matrix.length-1];
}

export default cf;