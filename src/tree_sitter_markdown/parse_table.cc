#include "./parse_table.h"

#include <cassert>

namespace tree_sitter_markdown {

bool is_inl_sym(const Symbol sym) { return sym >= FIRST_INLINE_SYMBOL && sym <= LAST_INLINE_SYMBOL; }
bool is_inl_cls_mrk_sym(const Symbol sym) { return sym >= FIRST_INLINE_CLOSE_MARKER_SYMBOL && sym <= LAST_INLINE_CLOSE_MARKER_SYMBOL; }
bool is_blk_sym(const Symbol sym) { return sym >= FIRST_BLOCK_SYMBOL && sym <= LAST_BLOCK_SYMBOL; }
bool is_blk_opn_sym(const Symbol sym) { return sym >= FIRST_BLOCK_OPEN_SYMBOL && sym <= LAST_BLOCK_OPEN_SYMBOL; }
bool is_blk_cls_sym(const Symbol sym) { return sym >= FIRST_BLOCK_CLOSE_SYMBOL && sym <= LAST_BLOCK_CLOSE_SYMBOL; }
bool is_paired_blk_syms(const Symbol opn_sym, const Symbol cls_sym) {
  if (opn_sym == SYM_PGH_BGN_MKR && cls_sym == SYM_LNK_REF_DEF_END_MKR) return true;
  return cls_sym == get_blk_cls_sym(opn_sym);
}
Symbol get_blk_cls_sym(const Symbol opn_sym) {
  switch (opn_sym) {
    case SYM_ASR_THM_BRK_BGN:
    case SYM_USC_THM_BRK_BGN:
    case SYM_HYP_THM_BRK_BGN: return SYM_THM_BRK_END_MKR;
    case SYM_PGH_BGN_MKR: return SYM_PGH_END_MKR;
    case SYM_EQL_STX_BGN:
    case SYM_HYP_STX_BGN: return SYM_STX_END_MKR;
    case SYM_ATX_BGN: return SYM_ATX_END_MKR;
    case SYM_IND_COD_BGN_MKR: return SYM_IND_COD_END_MKR;
    case SYM_BTK_FEN_COD_BGN: return SYM_BTK_FEN_COD_END_MKR;
    case SYM_TLD_FEN_COD_BGN: return SYM_TLD_FEN_COD_END_MKR;
    case SYM_HTM_BLK_SCR_BGN: return SYM_HTM_BLK_SCR_END_MKR;
    case SYM_HTM_BLK_CMT_BGN: return SYM_HTM_BLK_CMT_END_MKR;
    case SYM_HTM_BLK_PRC_BGN: return SYM_HTM_BLK_PRC_END_MKR;
    case SYM_HTM_BLK_DCL_BGN: return SYM_HTM_BLK_DCL_END_MKR;
    case SYM_HTM_BLK_CDA_BGN: return SYM_HTM_BLK_CDA_END_MKR;
    case SYM_HTM_BLK_DIV_BGN: return SYM_HTM_BLK_DIV_END_MKR;
    case SYM_HTM_BLK_CMP_BGN: return SYM_HTM_BLK_CMP_END_MKR;
    case SYM_BQT_BGN: return SYM_BQT_END_MKR;
    case SYM_ASR_LST_BGN_MKR:
    case SYM_HYP_LST_BGN_MKR:
    case SYM_PLS_LST_BGN_MKR:
    case SYM_DOT_LST_BGN_MKR:
    case SYM_RPR_LST_BGN_MKR: return SYM_LST_END_MKR;
    case SYM_ASR_LST_ITM_BGN:
    case SYM_HYP_LST_ITM_BGN:
    case SYM_PLS_LST_ITM_BGN:
    case SYM_DOT_LST_ITM_BGN:
    case SYM_RPR_LST_ITM_BGN: return SYM_LST_ITM_END_MKR;
    case SYM_LST_ITM_CNT_BGN_MKR: return SYM_LST_ITM_CNT_END_MKR;
    case SYM_TBL_HED_ROW_BGN_MKR:
    case SYM_TBL_DLM_ROW_BGN_MKR:
    case SYM_TBL_DAT_ROW_BGN_MKR: return SYM_TBL_ROW_END_MKR;
    default: assert(false);
  }
}

ParseState blk_sym_pst(const Symbol sym) {
  switch (sym) {
    case SYM_PGH_BGN_MKR: return PST_PGH;
    case SYM_ATX_BGN: return PST_ATX;
    case SYM_IND_COD_BGN_MKR: return PST_IND_COD;
    case SYM_BTK_FEN_COD_BGN: return PST_BTK_FEN_COD;
    case SYM_TLD_FEN_COD_BGN: return PST_TLD_FEN_COD;
    case SYM_HTM_BLK_SCR_BGN: return PST_HTM_BLK_SCR;
    case SYM_HTM_BLK_CMT_BGN: return PST_HTM_BLK_CMT;
    case SYM_HTM_BLK_PRC_BGN: return PST_HTM_BLK_PRC;
    case SYM_HTM_BLK_DCL_BGN: return PST_HTM_BLK_DCL;
    case SYM_HTM_BLK_CDA_BGN: return PST_HTM_BLK_CDA;
    case SYM_HTM_BLK_DIV_BGN: return PST_HTM_BLK_DIV;
    case SYM_HTM_BLK_CMP_BGN: return PST_HTM_BLK_CMP;
    case SYM_TBL_HED_ROW_BGN_MKR: return PST_TBL_DAT_ROW;
    case SYM_TBL_DLM_ROW_BGN_MKR: return PST_TBL_DLM_ROW;
    case SYM_TBL_DAT_ROW_BGN_MKR: return PST_TBL_DAT_ROW;
    default: return PST_INVALID;
  }
}

ParseState inl_sym_pst(const Symbol sym, const bool has_asr, const bool has_usc, const bool has_del) {
  switch (sym) {
    case SYM_ASR_BGN:
      return has_usc
        ? has_del
          ? PST_ASR_USC_DEL
          : PST_ASR_USC
        : has_del
          ? PST_ASR_DEL
          : PST_ASR;
    case SYM_USC_BGN:
      return has_asr
        ? has_del
          ? PST_ASR_USC_DEL
          : PST_ASR_USC
        : has_del
          ? PST_USC_DEL
          : PST_USC;
    case SYM_DEL_BGN:
      return has_asr
        ? has_usc
          ? PST_ASR_USC_DEL
          : PST_ASR_DEL
        : has_usc
          ? PST_USC_DEL
          : PST_DEL;
    case SYM_IMG_BGN:
    case SYM_LNK_BGN: return PST_IMG_LNK;
    case SYM_LNK_END: return PST_IMG_LNK_END;
    case SYM_LNK_REF_DEF_CLN: return PST_LNK_REF_DEF_CLN;
    case SYM_LNK_INL_BGN: return PST_LNK_INL;
    case SYM_LNK_DST_EXP_BGN: return PST_LNK_DST_EXP;
    case SYM_LNK_DST_IMP_BGN_MKR: return PST_LNK_DST_IMP;
    case SYM_LNK_DST_IMP_PRN_BGN: return PST_LNK_DST_IMP_PRN;
    case SYM_LNK_DST_END_MKR: return PST_LNK_DST_END;
    case SYM_LNK_TIT_SQT_BGN: return PST_LNK_TIT_SQT;
    case SYM_LNK_TIT_DQT_BGN: return PST_LNK_TIT_DQT;
    case SYM_LNK_TIT_PRN_BGN: return PST_LNK_TIT_PRN;
    case SYM_LNK_TIT_END_MKR: return PST_LNK_TIT_END;
    case SYM_LNK_REF_BGN: return PST_LNK_REF;
    case SYM_COD_SPN_BGN: return PST_COD_SPN;
    case SYM_EXT_WWW_AUT_LNK_BGN:
    case SYM_EXT_URL_AUT_LNK_BGN: return PST_EXT_AUT_LNK_DMN_END;
    case SYM_AUT_LNK_HTM_OPN_TAG_BGN: return PST_AUT_LNK_HTM_OPN_TAG;
    case SYM_URI_AUT_LNK_BGN: return PST_URI_AUT_LNK_SCH_END;
    case SYM_EML_AUT_LNK_BGN: return PST_EML_AUT_LNK;
    case SYM_EML_AUT_LNK_END_MKR: return PST_EML_AUT_LNK_DMN_END;
    case SYM_HTM_OPN_TAG_BGN: return PST_HTM_OPN_TAG;
    case SYM_HTM_CLS_TAG_BGN: return PST_HTM_CLS_TAG;
    case SYM_HTM_CLS_TAG_NAM_END_MKR: return PST_HTM_CLS_TAG_NAM_END;
    case SYM_HTM_DCL_BGN: return PST_HTM_DCL;
    case SYM_HTM_DCL_NAM_END_MKR: return PST_HTM_DCL_NAM_END;
    case SYM_HTM_ATR_KEY_END_MKR: return PST_HTM_ATR_KEY_END;
    case SYM_HTM_ATR_EQL: return PST_HTM_ATR_EQL;
    case SYM_HTM_ATR_UQT_BGN_MKR: return PST_HTM_ATR_UQT;
    case SYM_HTM_ATR_SQT_BGN: return PST_HTM_ATR_SQT;
    case SYM_HTM_ATR_DQT_BGN: return PST_HTM_ATR_DQT;
    case SYM_HTM_CMT_BGN: return PST_HTM_CMT;
    case SYM_HTM_PRC_BGN: return PST_HTM_PRC;
    case SYM_HTM_CDA_BGN: return PST_HTM_CDA;
    case SYM_FEN_COD_INF_BGN_MKR: return PST_FEN_COD_INF;
    default: return PST_INVALID;
  }
}

static bool PARSE_TABLE[PARSE_TABLE_STATE_COUNT][PARSE_TABLE_SYMBOL_COUNT] = {
  [PST_PGH] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_BSL_LBK] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_ASR_BGN] = true,
    [SYM_USC_BGN] = true,
    [SYM_DEL_BGN] = true,
    [SYM_IMG_BGN] = true,
    [SYM_LNK_BGN] = true,
    [SYM_COD_SPN_BGN] = true,
    [SYM_EXT_AUT_LNK_BGN] = true,
    [SYM_AUT_LNK_HTM_OPN_TAG_BGN] = true,
    [SYM_HTM_CLS_TAG_BGN] = true,
    [SYM_HTM_DCL_BGN] = true,
    [SYM_HTM_CMT_BGN] = true,
    [SYM_HTM_PRC_BGN] = true,
    [SYM_HTM_CDA_BGN] = true,
  },
  [PST_ATX] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_ASR_BGN] = true,
    [SYM_USC_BGN] = true,
    [SYM_DEL_BGN] = true,
    [SYM_IMG_BGN] = true,
    [SYM_LNK_BGN] = true,
    [SYM_COD_SPN_BGN] = true,
    [SYM_EXT_AUT_LNK_BGN] = true,
    [SYM_AUT_LNK_HTM_OPN_TAG_BGN] = true,
    [SYM_HTM_CLS_TAG_BGN] = true,
    [SYM_HTM_DCL_BGN] = true,
    [SYM_HTM_CMT_BGN] = true,
    [SYM_HTM_PRC_BGN] = true,
    [SYM_HTM_CDA_BGN] = true,
    [SYM_ATX_END] = true,
  },
  [PST_FEN_COD_INF] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_FEN_COD_INF_END_MKR] = true,
  },
  [PST_TBL_DLM_ROW] = {
    [SYM_WSP] = true,
    [SYM_TBL_COL_ALN] = true,
  },
  [PST_TBL_DAT_ROW] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_ASR_BGN] = true,
    [SYM_USC_BGN] = true,
    [SYM_DEL_BGN] = true,
    [SYM_IMG_BGN] = true,
    [SYM_LNK_BGN] = true,
    [SYM_COD_SPN_BGN] = true,
    [SYM_EXT_AUT_LNK_BGN] = true,
    [SYM_AUT_LNK_HTM_OPN_TAG_BGN] = true,
    [SYM_HTM_CLS_TAG_BGN] = true,
    [SYM_HTM_DCL_BGN] = true,
    [SYM_HTM_CMT_BGN] = true,
    [SYM_HTM_PRC_BGN] = true,
    [SYM_HTM_CDA_BGN] = true,
  },
  [PST_ASR] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_BSL_LBK] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_ASR_BGN] = true,
    [SYM_ASR_END] = true,
    [SYM_USC_BGN] = true,
    [SYM_DEL_BGN] = true,
    [SYM_IMG_BGN] = true,
    [SYM_LNK_BGN] = true,
    [SYM_COD_SPN_BGN] = true,
    [SYM_EXT_AUT_LNK_BGN] = true,
    [SYM_AUT_LNK_HTM_OPN_TAG_BGN] = true,
    [SYM_HTM_CLS_TAG_BGN] = true,
    [SYM_HTM_DCL_BGN] = true,
    [SYM_HTM_CMT_BGN] = true,
    [SYM_HTM_PRC_BGN] = true,
    [SYM_HTM_CDA_BGN] = true,
  },
  [PST_USC] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_BSL_LBK] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_ASR_BGN] = true,
    [SYM_USC_BGN] = true,
    [SYM_USC_END] = true,
    [SYM_DEL_BGN] = true,
    [SYM_IMG_BGN] = true,
    [SYM_LNK_BGN] = true,
    [SYM_COD_SPN_BGN] = true,
    [SYM_EXT_AUT_LNK_BGN] = true,
    [SYM_AUT_LNK_HTM_OPN_TAG_BGN] = true,
    [SYM_HTM_CLS_TAG_BGN] = true,
    [SYM_HTM_DCL_BGN] = true,
    [SYM_HTM_CMT_BGN] = true,
    [SYM_HTM_PRC_BGN] = true,
    [SYM_HTM_CDA_BGN] = true,
  },
  [PST_DEL] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_BSL_LBK] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_ASR_BGN] = true,
    [SYM_USC_BGN] = true,
    [SYM_DEL_BGN] = true,
    [SYM_DEL_END] = true,
    [SYM_IMG_BGN] = true,
    [SYM_LNK_BGN] = true,
    [SYM_COD_SPN_BGN] = true,
    [SYM_EXT_AUT_LNK_BGN] = true,
    [SYM_AUT_LNK_HTM_OPN_TAG_BGN] = true,
    [SYM_HTM_CLS_TAG_BGN] = true,
    [SYM_HTM_DCL_BGN] = true,
    [SYM_HTM_CMT_BGN] = true,
    [SYM_HTM_PRC_BGN] = true,
    [SYM_HTM_CDA_BGN] = true,
  },
  [PST_ASR_USC] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_BSL_LBK] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_ASR_BGN] = true,
    [SYM_ASR_END] = true,
    [SYM_USC_BGN] = true,
    [SYM_USC_END] = true,
    [SYM_DEL_BGN] = true,
    [SYM_IMG_BGN] = true,
    [SYM_LNK_BGN] = true,
    [SYM_COD_SPN_BGN] = true,
    [SYM_EXT_AUT_LNK_BGN] = true,
    [SYM_AUT_LNK_HTM_OPN_TAG_BGN] = true,
    [SYM_HTM_CLS_TAG_BGN] = true,
    [SYM_HTM_DCL_BGN] = true,
    [SYM_HTM_CMT_BGN] = true,
    [SYM_HTM_PRC_BGN] = true,
    [SYM_HTM_CDA_BGN] = true,
  },
  [PST_ASR_DEL] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_BSL_LBK] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_ASR_BGN] = true,
    [SYM_ASR_END] = true,
    [SYM_USC_BGN] = true,
    [SYM_DEL_BGN] = true,
    [SYM_DEL_END] = true,
    [SYM_IMG_BGN] = true,
    [SYM_LNK_BGN] = true,
    [SYM_COD_SPN_BGN] = true,
    [SYM_EXT_AUT_LNK_BGN] = true,
    [SYM_AUT_LNK_HTM_OPN_TAG_BGN] = true,
    [SYM_HTM_CLS_TAG_BGN] = true,
    [SYM_HTM_DCL_BGN] = true,
    [SYM_HTM_CMT_BGN] = true,
    [SYM_HTM_PRC_BGN] = true,
    [SYM_HTM_CDA_BGN] = true,
  },
  [PST_USC_DEL] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_BSL_LBK] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_ASR_BGN] = true,
    [SYM_USC_BGN] = true,
    [SYM_USC_END] = true,
    [SYM_DEL_BGN] = true,
    [SYM_DEL_END] = true,
    [SYM_IMG_BGN] = true,
    [SYM_LNK_BGN] = true,
    [SYM_COD_SPN_BGN] = true,
    [SYM_EXT_AUT_LNK_BGN] = true,
    [SYM_AUT_LNK_HTM_OPN_TAG_BGN] = true,
    [SYM_HTM_CLS_TAG_BGN] = true,
    [SYM_HTM_DCL_BGN] = true,
    [SYM_HTM_CMT_BGN] = true,
    [SYM_HTM_PRC_BGN] = true,
    [SYM_HTM_CDA_BGN] = true,
  },
  [PST_ASR_USC_DEL] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_BSL_LBK] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_ASR_BGN] = true,
    [SYM_ASR_END] = true,
    [SYM_USC_BGN] = true,
    [SYM_USC_END] = true,
    [SYM_DEL_BGN] = true,
    [SYM_DEL_END] = true,
    [SYM_IMG_BGN] = true,
    [SYM_LNK_BGN] = true,
    [SYM_COD_SPN_BGN] = true,
    [SYM_EXT_AUT_LNK_BGN] = true,
    [SYM_AUT_LNK_HTM_OPN_TAG_BGN] = true,
    [SYM_HTM_CLS_TAG_BGN] = true,
    [SYM_HTM_DCL_BGN] = true,
    [SYM_HTM_CMT_BGN] = true,
    [SYM_HTM_PRC_BGN] = true,
    [SYM_HTM_CDA_BGN] = true,
  },
  [PST_IMG_LNK] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_BSL_LBK] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_IMG_BGN] = true,
    [SYM_LNK_BGN] = true,
    [SYM_LNK_END] = true,
    [SYM_COD_SPN_BGN] = true,
    [SYM_AUT_LNK_HTM_OPN_TAG_BGN] = true,
    [SYM_HTM_CLS_TAG_BGN] = true,
    [SYM_HTM_DCL_BGN] = true,
    [SYM_HTM_CMT_BGN] = true,
    [SYM_HTM_PRC_BGN] = true,
    [SYM_HTM_CDA_BGN] = true,
  },
  [PST_IMG_LNK_END] = {
    [SYM_LNK_REF_DEF_CLN] = true,
    [SYM_LNK_INL_BGN] = true,
    [SYM_LNK_REF_BGN] = true,
  },
  [PST_LNK_REF_DEF_CLN] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_LNK_DST_EXP_BGN] = true,
    [SYM_LNK_DST_IMP_PRN_BGN] = true,
  },
  [PST_LNK_INL] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_LNK_INL_END] = true,
    [SYM_LNK_DST_EXP_BGN] = true,
    [SYM_LNK_DST_IMP_PRN_BGN] = true,
  },
  [PST_LNK_DST_EXP] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_LNK_DST_EXP_END] = true,
  },
  [PST_LNK_DST_IMP] = {
    [SYM_TXT] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_LNK_DST_IMP_PRN_BGN] = true,
  },
  [PST_LNK_DST_IMP_PRN] = {
    [SYM_TXT] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_LNK_DST_IMP_PRN_BGN] = true,
    [SYM_LNK_DST_IMP_PRN_END] = true,
  },
  [PST_LNK_DST_END] = {
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_LNK_INL_END] = true,
    [SYM_LNK_TIT_SQT_BGN] = true,
    [SYM_LNK_TIT_DQT_BGN] = true,
    [SYM_LNK_TIT_PRN_BGN] = true,
  },
  [PST_LNK_TIT_SQT] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_LNK_TIT_SQT_END] = true,
  },
  [PST_LNK_TIT_DQT] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_LNK_TIT_DQT_END] = true,
  },
  [PST_LNK_TIT_PRN] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_BSL_ESC] = true,
    [SYM_CHR_REF] = true,
    [SYM_LNK_TIT_PRN_END] = true,
  },
  [PST_LNK_TIT_END] = {
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_LNK_INL_END] = true,
  },
  [PST_LNK_REF] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_BSL_ESC] = true,
    [SYM_LNK_REF_END] = true,
  },
  [PST_COD_SPN] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_COD_SPN_END] = true,
  },
  [PST_EXT_AUT_LNK_DMN_END] = {
    [SYM_EXT_AUT_LNK_CTN] = true,
  },
  [PST_AUT_LNK_HTM_OPN_TAG] = {
    [SYM_TXT] = true,
  },
  [PST_URI_AUT_LNK_SCH_END] = {
    [SYM_TXT] = true,
    [SYM_AUT_LNK_END] = true,
  },
  [PST_EML_AUT_LNK] = {
    [SYM_TXT] = true,
  },
  [PST_EML_AUT_LNK_DMN_END] = {
    [SYM_AUT_LNK_END] = true,
  },
  [PST_HTM_OPN_TAG] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_HTM_TAG_END] = true,
    [SYM_HTM_SLF_TAG_END] = true,
  },
  [PST_HTM_CLS_TAG] = {
    [SYM_TXT] = true,
  },
  [PST_HTM_CLS_TAG_NAM_END] = {
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_HTM_TAG_END] = true,
  },
  [PST_HTM_DCL] = {
    [SYM_TXT] = true,
  },
  [PST_HTM_DCL_NAM_END] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_HTM_TAG_END] = true,
  },
  [PST_HTM_ATR_KEY_END] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_HTM_TAG_END] = true,
    [SYM_HTM_SLF_TAG_END] = true,
    [SYM_HTM_ATR_EQL] = true,
  },
  [PST_HTM_ATR_EQL] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_HTM_ATR_SQT_BGN] = true,
    [SYM_HTM_ATR_DQT_BGN] = true,
  },
  [PST_HTM_ATR_UQT] = {
    [SYM_TXT] = true,
  },
  [PST_HTM_ATR_SQT] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_HTM_ATR_SQT_END] = true,
  },
  [PST_HTM_ATR_DQT] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_HTM_ATR_DQT_END] = true,
  },
  [PST_HTM_CMT] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_HTM_CMT_END] = true,
  },
  [PST_HTM_PRC] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_HTM_PRC_END] = true,
  },
  [PST_HTM_CDA] = {
    [SYM_TXT] = true,
    [SYM_WSP] = true,
    [SYM_LIT_LBK] = true,
    [SYM_HTM_CDA_END] = true,
  },
  [PST_IND_COD] = { [SYM_BLK_TXT] = true },
  [PST_BTK_FEN_COD] = { [SYM_BLK_TXT] = true },
  [PST_TLD_FEN_COD] = { [SYM_BLK_TXT] = true },
  [PST_HTM_BLK_SCR] = { [SYM_BLK_TXT] = true },
  [PST_HTM_BLK_CMT] = { [SYM_BLK_TXT] = true },
  [PST_HTM_BLK_PRC] = { [SYM_BLK_TXT] = true },
  [PST_HTM_BLK_DCL] = { [SYM_BLK_TXT] = true },
  [PST_HTM_BLK_CDA] = { [SYM_BLK_TXT] = true },
  [PST_HTM_BLK_DIV] = { [SYM_BLK_TXT] = true },
  [PST_HTM_BLK_CMP] = { [SYM_BLK_TXT] = true },
};

bool vld_sym(const Symbol sym, const ParseState pst) {
  return PARSE_TABLE[pst][sym];
}

}
