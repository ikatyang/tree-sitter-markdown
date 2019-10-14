module.exports = grammar({
  name: "markdown",

  externals: $ => [
    $._eof,
    $._lka,

    $._thm_brk_bgn,                                         $._thm_brk_end_mkr,
    $._pgh_bgn_mkr,                                         $._pgh_end_mkr,
                                                            $._lnk_ref_def_end_mkr,
    $._stx_bgn,                                             $._stx_end_mkr,
    $._atx_bgn,                                             $._atx_end_mkr,
    $._ind_cod_bgn_pfx,
    $._ind_cod_bgn_mkr,                                     $._ind_cod_end_mkr,
    $._fen_cod_ctn_bgn_mkr,
    $._fen_cod_bgn,             $._fen_cod_end,             $._fen_cod_end_mkr,
    $._htm_blk_scr_bgn_mkr,     $._htm_blk_scr_end,         $._htm_blk_scr_end_mkr,
    $._htm_blk_cmt_bgn_mkr,     $._htm_blk_cmt_end,         $._htm_blk_cmt_end_mkr,
    $._htm_blk_prc_bgn_mkr,     $._htm_blk_prc_end,         $._htm_blk_prc_end_mkr,
    $._htm_blk_dcl_bgn_mkr,     $._htm_blk_dcl_end,         $._htm_blk_dcl_end_mkr,
    $._htm_blk_cda_bgn_mkr,     $._htm_blk_cda_end,         $._htm_blk_cda_end_mkr,
    $._htm_blk_div_bgn_mkr,                                 $._htm_blk_div_end_mkr,
    $._htm_blk_cmp_bgn_mkr,                                 $._htm_blk_cmp_end_mkr,
    $._bqt_bgn,                                             $._bqt_end_mkr,
    $._lst_bgn_mkr,                                         $._lst_end_mkr,
    $._lst_itm_bgn,                                         $._lst_itm_end_mkr,
    $._lst_itm_cnt_bgn_mkr,                                 $._lst_itm_cnt_end_mkr,
    $._tbl_hed_row_bgn_mkr,
    $._tbl_dlm_row_bgn_mkr,
    $._tbl_dat_row_bgn_mkr,                                 $._tbl_row_end_mkr,

    $._bsl_esc,
    $._chr_ref,
    $._emp_bgn,                 $._emp_end,
    $._stg_bgn,                 $._stg_end,
    $._del_bgn,                 $._del_end,
    $._img_bgn,
    $._lnk_bgn,                 $._lnk_end,
    $._lnk_ref_def_bgn,
    $._lnk_ref_def_cln,
    $._lnk_inl_bgn,             $._lnk_inl_end,
    $._lnk_dst_bgn,             $._lnk_dst_end,
    $._lnk_dst_bgn_mkr,         $._lnk_dst_end_mkr,
    $._lnk_tit_bgn,             $._lnk_tit_end,
    $._lnk_ref_bgn,             $._lnk_ref_end,
    $._ext_www_aut_lnk_bgn_mkr,
    $._ext_url_aut_lnk_bgn_mkr,
    $._ext_eml_aut_lnk_bgn_mkr, $._ext_aut_lnk_end_mkr,
    $._uri_aut_lnk_bgn,
    $._eml_aut_lnk_bgn,         $._aut_lnk_end,
    $._cod_spn_bgn,             $._cod_spn_end,
    $._htm_opn_tag_bgn,         $._htm_tag_end,
    $._htm_cls_tag_bgn,         $._htm_slf_tag_end,
    $._htm_dcl_bgn,
    $._htm_atr_eql,
    $._htm_atr_val_bgn,         $._htm_atr_val_end,
    $._htm_atr_val_bgn_mkr,     $._htm_atr_val_end_mkr,
    $._htm_cmt_bgn,             $._htm_cmt_end,
    $._htm_prc_bgn,             $._htm_prc_end,
    $._htm_cda_bgn,             $._htm_cda_end,
    $._atx_end,
    $._lst_chk_box,
    $._tbl_col_sep,
    $._tbl_col_aln,
    $._fen_cod_inf_bgn_mkr,     $._fen_cod_inf_end_mkr,
    $._hrd_lbk,
    $._sft_lbk,

    $._blk_lbk,
    $._bnk_lbk,
    $._lit_lbk,
    $._wsp,
    $._txt_frg,
    $._wrd,

    $._vtr_spc,
  ],

  conflicts: $ => [
    [$._chk_box_pgh_ctn, $._chk_box_lik_stx_ctn], // requires 2 lookahead tokens to distinguish them
    [$._fen_cod_ctn], // require 2 lookahead tokens to distinguish the belonging of its next token ($._blk_lbk)
  ],

  extras: $ => [$._lka, $._lit_lbk, $._wsp],

  rules: {
    document: $ => seq(repeat(choice($._blk_nod, $._bnk_lbk)), $._eof),

    _blk_nod: $ => choice($._thm_brk, $._pgh, $._lnk_ref_def, $._stx, $._atx, $._ind_cod, $._fen_cod, $._htm_blk_scr, $._htm_blk_cmt, $._htm_blk_prc, $._htm_blk_dcl, $._htm_blk_cda, $._htm_blk_div, $._htm_blk_cmp, $._bqt, $._tig_lst, $._los_lst, $._tbl),

    _thm_brk: $ => seq($._thm_brk_hed, $._thm_brk_end_mkr),
    _thm_brk_hed: $ => $._thm_brk_bgn,
    _pgh: $ => seq(alias($._pgh_hed, $.paragraph), $._pgh_end_mkr),
    _pgh_hed: $ => seq($._pgh_bgn_mkr, repeat(choice($._inl_nod, $._inl_lbk))),
    _lnk_ref_def: $ => seq($._lnk_ref_def_hed, $._lnk_ref_def_end_mkr),
    _lnk_ref_def_hed: $ => seq($._pgh_bgn_mkr, $._lnk_ref_def_bgn, alias(repeat(choice($._txt, $._bsl_esc)), $.link_label), $._lnk_end, $._lnk_ref_def_cln, $._lnk_dst, optional($._lnk_tit)),
    _stx: $ => seq($._stx_hed, $._stx_end_mkr),
    _stx_hed: $ => seq(alias($._pgh_hed, $.heading_content), $._pgh_end_mkr, $._stx_bgn),
    _atx: $ => seq($._atx_hed, $._atx_end_mkr),
    _atx_hed: $ => seq($._atx_bgn, alias(repeat($._inl_nod), $.heading_content), optional($._atx_end)),
    _ind_cod: $ => seq($._ind_cod_bgn_pfx, $._ind_cod_hed, $._ind_cod_end_mkr),
    _ind_cod_hed: $ => seq($._ind_cod_bgn_mkr, repeat(choice($._vtr_spc, $._txt, $._blk_lbk))),
    _fen_cod: $ => seq($._fen_cod_hed, $._fen_cod_end_mkr),
    _fen_cod_hed: $ => seq(
      $._fen_cod_bgn,
      optional($._fen_cod_inf),
      optional(seq($._blk_lbk, optional(alias($._fen_cod_ctn, $.code_fence_content)))),
      optional(seq($._blk_lbk, $._fen_cod_end)),
    ),
    _fen_cod_inf: $ => seq($._fen_cod_inf_bgn_mkr, alias(repeat(choice($._inl_txt)), $.info_string), $._fen_cod_inf_end_mkr),
    _fen_cod_ctn: $ => seq($._fen_cod_ctn_bgn_mkr, repeat(choice($._vtr_spc, $._txt, $._blk_lbk))),
    _htm_blk_scr: $ => seq($._htm_blk_scr_hed, $._htm_blk_scr_end_mkr),
    _htm_blk_scr_hed: $ => seq($._htm_blk_scr_bgn_mkr, repeat(choice($._vtr_spc, $._txt, $._blk_lbk)), optional($._htm_blk_scr_end)),
    _htm_blk_cmt: $ => seq($._htm_blk_cmt_hed, $._htm_blk_cmt_end_mkr),
    _htm_blk_cmt_hed: $ => seq($._htm_blk_cmt_bgn_mkr, repeat(choice($._vtr_spc, $._txt, $._blk_lbk)), optional($._htm_blk_cmt_end)),
    _htm_blk_prc: $ => seq($._htm_blk_prc_hed, $._htm_blk_prc_end_mkr),
    _htm_blk_prc_hed: $ => seq($._htm_blk_prc_bgn_mkr, repeat(choice($._vtr_spc, $._txt, $._blk_lbk)), optional($._htm_blk_prc_end)),
    _htm_blk_dcl: $ => seq($._htm_blk_dcl_hed, $._htm_blk_dcl_end_mkr),
    _htm_blk_dcl_hed: $ => seq($._htm_blk_dcl_bgn_mkr, repeat(choice($._vtr_spc, $._txt, $._blk_lbk)), optional($._htm_blk_dcl_end)),
    _htm_blk_cda: $ => seq($._htm_blk_cda_hed, $._htm_blk_cda_end_mkr),
    _htm_blk_cda_hed: $ => seq($._htm_blk_cda_bgn_mkr, repeat(choice($._vtr_spc, $._txt, $._blk_lbk)), optional($._htm_blk_cda_end)),
    _htm_blk_div: $ => seq($._htm_blk_div_hed, $._htm_blk_div_end_mkr),
    _htm_blk_div_hed: $ => seq($._htm_blk_div_bgn_mkr, repeat(choice($._vtr_spc, $._txt, $._blk_lbk))),
    _htm_blk_cmp: $ => seq($._htm_blk_cmp_hed, $._htm_blk_cmp_end_mkr),
    _htm_blk_cmp_hed: $ => seq($._htm_blk_cmp_bgn_mkr, repeat(choice($._vtr_spc, $._txt, $._blk_lbk))),
    _bqt: $ => seq($._bqt_hed, $._bqt_end_mkr),
    _bqt_hed: $ => seq($._bqt_bgn, repeat(choice($._blk_nod, $._bnk_lbk))),

    _tig_lst: $ => seq($._tig_lst_hed, $._lst_end_mkr),
    _tig_lst_hed: $ => seq($._lst_bgn_mkr, repeat($._tig_lst_itm)),
    _los_lst: $ => seq($._los_lst_hed, $._lst_end_mkr),
    _los_lst_hed: $ => seq($._lst_bgn_mkr, repeat($._tig_lst_itm), choice($._bnk_lbk, $._los_lst_itm), repeat(choice($._tig_lst_itm, $._los_lst_itm, $._bnk_lbk))),
    _tig_lst_itm: $ => seq(choice($._tig_lst_itm_hed, $._tig_chk_box_lst_itm_hed), $._lst_itm_cnt_end_mkr, $._lst_itm_end_mkr),
    _tig_lst_itm_hed: $ => seq($._lst_itm_bgn, $._lst_itm_cnt_bgn_mkr, optional($._chk_box_lik_stx), repeat($._blk_nod)),
    _tig_chk_box_lst_itm_hed: $ => seq($._lst_itm_bgn, $._lst_itm_cnt_bgn_mkr, $._chk_box_pgh, repeat($._blk_nod)),
    _los_lst_itm: $ => seq(choice($._los_lst_itm_hed, $._los_chk_box_lst_itm_hed), $._lst_itm_cnt_end_mkr, $._lst_itm_end_mkr),
    _los_lst_itm_hed: $ => seq($._lst_itm_bgn, $._lst_itm_cnt_bgn_mkr, optional($._chk_box_lik_stx), repeat($._blk_nod), $._bnk_lbk, repeat(choice($._bnk_lbk, $._blk_nod))),
    _los_chk_box_lst_itm_hed: $ => seq($._lst_itm_bgn, $._lst_itm_cnt_bgn_mkr, $._chk_box_pgh, repeat($._blk_nod), $._bnk_lbk, repeat(choice($._bnk_lbk, $._blk_nod))),

    _chk_box_pgh: $ => seq($._pgh_bgn_mkr, alias($._chk_box_pgh_ctn, $.paragraph), $._pgh_end_mkr),
    _chk_box_pgh_ctn: $ => seq(alias($._lst_chk_box, $.task_list_item_marker), repeat(choice($._inl_nod, $._inl_lbk))),
    _chk_box_lik_stx: $ => seq(alias($._chk_box_lik_stx_hed, $.setext_heading), $._stx_end_mkr),
    _chk_box_lik_stx_hed:$ =>  seq($._pgh_bgn_mkr, alias($._chk_box_lik_stx_ctn, $.heading_content), $._pgh_end_mkr, $._stx_bgn),
    _chk_box_lik_stx_ctn: $ => seq($._lst_chk_box, repeat(choice($._inl_nod, $._inl_lbk))),

    _tbl: $ => seq($._tbl_hed_row, $._tbl_dlm_row, repeat($._tbl_dat_row)),
    _tbl_hed_row: $ => seq($._tbl_hed_row_hed, $._tbl_row_end_mkr),
    _tbl_hed_row_hed: $ => seq($._tbl_hed_row_bgn_mkr, optional($._tbl_col_sep), $._tbl_dat_cel, repeat(seq($._tbl_col_sep, $._tbl_dat_cel)), optional($._tbl_col_sep)),
    _tbl_dlm_row: $ => seq($._tbl_dlm_row_hed, $._tbl_row_end_mkr),
    _tbl_dlm_row_hed: $ => seq($._tbl_dlm_row_bgn_mkr, optional($._tbl_col_sep), $._tbl_col_aln, repeat(seq($._tbl_col_sep, $._tbl_col_aln)), optional($._tbl_col_sep)),
    _tbl_dat_row: $ => seq($._tbl_dat_row_hed, $._tbl_row_end_mkr),
    _tbl_dat_row_hed: $ => seq($._tbl_dat_row_bgn_mkr, optional($._tbl_col_sep), $._tbl_dat_cel, repeat(seq($._tbl_col_sep, $._tbl_dat_cel)), optional($._tbl_col_sep)),
    _tbl_dat_cel: $ => repeat1($._inl_nod),

    _inl_nod: $ => choice($._inl_txt, $._emp, $._stg, $._del, $._lnk, $._img, $._ext_www_aut_lnk, $._ext_url_aut_lnk, $._ext_eml_aut_lnk, $._uri_aut_lnk, $._eml_aut_lnk, $._cod_spn, $._htm_opn_tag, $._htm_slf_cls_tag, $._htm_cls_tag, $._htm_cmt, $._htm_prc, $._htm_dcl, $._htm_cda),
    _inl_txt: $ => choice($._txt, $._bsl_esc, $._chr_ref),
    _inl_lbk: $ => choice($._sft_lbk, $._hrd_lbk),

    _emp: $ => seq($._emp_bgn, repeat(choice($._inl_nod, $._inl_lbk)), $._emp_end),
    _stg: $ => seq($._stg_bgn, repeat(choice($._inl_nod, $._inl_lbk)), $._stg_end),
    _del: $ => seq($._del_bgn, repeat(choice($._inl_nod, $._inl_lbk)), $._del_end),

    _lnk: $ => seq($._lnk_bgn, alias(repeat(choice($._inl_nod, $._inl_lbk)), $.link_text), $._lnk_tal),
    _img: $ => seq($._img_bgn, alias(repeat(choice($._inl_nod, $._inl_lbk)), $.image_description), $._lnk_tal),
    _lnk_tal: $ => seq(
      $._lnk_end,
      optional(choice($._lnk_tal_inl, $._lnk_tal_ful, $._lnk_tal_clp)),
    ),
    _lnk_tal_inl: $ => seq(
      $._lnk_inl_bgn,
      optional(seq($._lnk_dst, optional($._lnk_tit))),
      $._lnk_inl_end,
    ),
    _lnk_tal_ful: $ => seq($._lnk_ref_bgn, alias(repeat1(choice($._txt, $._bsl_esc)), $.link_label), $._lnk_ref_end),
    _lnk_tal_clp: $ => seq($._lnk_ref_bgn, $._lnk_ref_end),
    _lnk_dst: $ => choice(
      seq($._lnk_dst_bgn, repeat($._inl_txt), $._lnk_dst_end),
      seq($._lnk_dst_bgn_mkr, repeat($._inl_txt), $._lnk_dst_end_mkr),
    ),
    _lnk_tit: $ => seq($._lnk_tit_bgn, repeat($._inl_txt), $._lnk_tit_end),

    _ext_www_aut_lnk: $ => seq($._ext_www_aut_lnk_hed, $._ext_aut_lnk_end_mkr),
    _ext_www_aut_lnk_hed: $ => seq($._ext_www_aut_lnk_bgn_mkr, repeat(choice($._txt, $._bsl_esc))),
    _ext_url_aut_lnk: $ => seq($._ext_url_aut_lnk_hed, $._ext_aut_lnk_end_mkr),
    _ext_url_aut_lnk_hed: $ => seq($._ext_url_aut_lnk_bgn_mkr, repeat(choice($._txt, $._bsl_esc))),
    _ext_eml_aut_lnk: $ => seq($._ext_eml_aut_lnk_hed, $._ext_aut_lnk_end_mkr),
    _ext_eml_aut_lnk_hed: $ => seq($._ext_eml_aut_lnk_bgn_mkr, repeat(choice($._txt, $._bsl_esc))),
    _uri_aut_lnk: $ => seq($._uri_aut_lnk_bgn, repeat(choice($._txt, $._bsl_esc)), $._aut_lnk_end),
    _eml_aut_lnk: $ => seq($._eml_aut_lnk_bgn, repeat(choice($._txt, $._bsl_esc)), $._aut_lnk_end),
    _cod_spn: $ => seq($._cod_spn_bgn, repeat(choice($._txt, $._bsl_esc)), $._cod_spn_end),
    _htm_opn_tag: $ => seq($._htm_opn_tag_hed, $._htm_tag_end),
    _htm_slf_cls_tag: $ => seq($._htm_opn_tag_hed, $._htm_slf_tag_end),
    _htm_opn_tag_hed: $ => seq($._htm_opn_tag_bgn, alias($._wrd, $.html_tag_name), repeat($._htm_atr)),
    _htm_cls_tag: $ => seq($._htm_cls_tag_bgn, alias($._wrd, $.html_tag_name), $._htm_tag_end),
    _htm_cmt: $ => seq($._htm_cmt_bgn, repeat(choice($._txt, $._bsl_esc)), $._htm_cmt_end),
    _htm_prc: $ => seq($._htm_prc_bgn, repeat(choice($._txt, $._bsl_esc)), $._htm_prc_end),
    _htm_dcl: $ => seq($._htm_dcl_bgn, alias($._wrd, $.html_declaration_name), repeat(choice($._txt, $._bsl_esc)), $._htm_tag_end),
    _htm_cda: $ => seq($._htm_cda_bgn, repeat(choice($._txt, $._bsl_esc)), $._htm_cda_end),
    _htm_atr: $ => seq(alias($._wrd, $.html_attribute_key), optional(seq($._htm_atr_eql, $._htm_atr_val))),
    _htm_atr_val: $ => choice(
      seq($._htm_atr_val_bgn, repeat(choice($._txt, $._bsl_esc)), $._htm_atr_val_end),
      seq($._htm_atr_val_bgn_mkr, repeat(choice($._txt, $._bsl_esc)), $._htm_atr_val_end_mkr),
    ),

    _txt: $ => prec.right(repeat1($._txt_frg)),
  },
});

module.exports = global_alias(module.exports, {
  // block node
  ..._('thematic_break', '_thm_brk_hed'),
  ..._('link_reference_definition', '_lnk_ref_def_hed'),
  ..._('setext_heading', '_stx_hed'),
  ..._('atx_heading', '_atx_hed'),
  ..._('indented_code_block', '_ind_cod_hed'),
  ..._(['fenced_code_block'], '_fen_cod_hed'),
  ..._('html_block', '_htm_blk_scr_hed', '_htm_blk_cmt_hed', '_htm_blk_prc_hed',
                     '_htm_blk_dcl_hed', '_htm_blk_cda_hed', '_htm_blk_div_hed',
                     '_htm_blk_cmp_hed'),
  ..._('block_quote', '_bqt_hed'),
  ..._('tight_list', '_tig_lst_hed'),
  ..._('loose_list', '_los_lst_hed'),
  ..._('list_item', '_tig_lst_itm_hed', '_los_lst_itm_hed'),
  ..._('task_list_item', '_tig_chk_box_lst_itm_hed', '_los_chk_box_lst_itm_hed'),
  ..._('table', '_tbl'),
  ..._('table_header_row', '_tbl_hed_row_hed'),
  ..._('table_delimiter_row', '_tbl_dlm_row_hed'),
  ..._('table_data_row', '_tbl_dat_row_hed'),
  ..._('table_cell', '_tbl_dat_cel'),

  // inline node
  ..._('emphasis', '_emp'),
  ..._('strong_emphasis', '_stg'),
  ..._('strikethrough', '_del'),
  ..._('link', '_lnk'),
  ..._('image', '_img'),
  ..._('link_destination', '_lnk_dst'),
  ..._('link_title', '_lnk_tit'),
  ..._('www_autolink', '_ext_www_aut_lnk'),
  ..._('uri_autolink', '_ext_url_aut_lnk', '_uri_aut_lnk'),
  ..._('email_autolink', '_ext_eml_aut_lnk', '_eml_aut_lnk'),
  ..._('code_span', '_cod_spn'),
  ..._('html_open_tag', '_htm_opn_tag'),
  ..._('html_self_closing_tag', '_htm_slf_cls_tag'),
  ..._('html_close_tag', '_htm_cls_tag'),
  ..._('html_comment', '_htm_cmt'),
  ..._('html_processing_instruction', '_htm_prc'),
  ..._('html_declaration', '_htm_dcl'),
  ..._('html_cdata_section', '_htm_cda'),
  ..._('html_atrribute', '_htm_atr'),
  ..._('html_attribute_value', '_htm_atr_val'),

  // block token
  ..._('virtual_space', '_vtr_spc'),
  ..._('atx_heading_marker', '_atx_bgn'),
  ..._('setext_heading_underline', '_stx_bgn'),
  ..._('list_marker', '_lst_itm_bgn'),
  ..._('line_break', '_blk_lbk'),

  // inline token
  ..._('text', '_txt'),
  ..._('backslash_escape', '_bsl_esc'),
  ..._('character_reference', '_chr_ref'),
  ..._('table_column_alignment', '_tbl_col_aln'),
  ..._('hard_line_break', '_hrd_lbk'),
  ..._('soft_line_break', '_sft_lbk'),
});

function _(alias_value, ...rule_names) {
  const alias_content = {};
  if (typeof alias_value === "string") {
    alias_content.name = alias_value;
  } else if (Array.isArray(alias_value)) {
    alias_content.name = alias_value[0];
    alias_content.shallow = true;
  } else {
    throw new Error(`Unexpected value ${JSON.stringify(alias_value)}`);
  }
  const alias_map = {};
  for (const rule_name of rule_names) {
    alias_map[rule_name] = alias_content;
  }
  return alias_map;
}

function global_alias(grammar_json, alias_map) {
  const new_rules = {};
  const new_grammar = { ...grammar_json, rules: new_rules };
  const checklist = Object.fromEntries(Object.entries(alias_map).map(([k, v]) => [k, 0]));
  for (const [rule_name, rule] of Object.entries(grammar_json.rules)) {
    new_rules[rule_name] = rule_name in alias_map && alias_map[rule_name].shallow
      ? rule
      : recursive_alias(rule, alias_map, checklist);
  }
  for (const [rule_name, counter] of Object.entries(checklist)) {
    if (counter === 0) {
      console.warn(`warning: global_alias for ${JSON.stringify(rule_name)} is not used.`);
    }
  }
  return new_grammar;
}

function recursive_alias(rule, alias_map, checklist) {
  switch (rule.type) {
    case "CHOICE":
    case "SEQ":
      return { ...rule, members: rule.members.map(member => recursive_alias(member, alias_map, checklist)) };
    case "REPEAT":
    case "REPEAT1":
    case "FIELD":
    case "ALIAS":
    case "PREC_RIGHT":
      return { ...rule, content: recursive_alias(rule.content, alias_map, checklist) };
    case "SYMBOL":
      if (rule.name in alias_map) {
        checklist[rule.name]++;
        return { type: "ALIAS", content: rule, named: true, value: alias_map[rule.name].name };
      }
    case "BLANK":
      return rule;
    default:
      throw new Error(`Unexpected rule type ${JSON.stringify(rule.type)}`);
  }
}
